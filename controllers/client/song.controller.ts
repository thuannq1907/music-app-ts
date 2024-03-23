import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;

  // dựa vào slug gửi lên -> lấy ra thông tin chủ đề
  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active"
  });

  // dựa vào chủ đề -> lấy ra tất cả bài hát có id của chủ đề đó
  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active"
  }).select("avatar title singerId like slug");

  // vì mỗi bài hát chỉ lưu id của ca sĩ -> từ id đó tìm ra t.tin ca sĩ rồi thêm vào bài hát
  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    });

    song["infoSinger"] = infoSinger;
  }

  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: songs
  });
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;

  // từ slug gửi lên -> tìm ra bài hát
  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active"
  });

  // từ bài hát -> tìm ra ca sĩ thông qua singerId
  const singer = await Singer.findOne({
    _id:song.singerId,
    deleted: false
  }).select("fullName");

  // từ bài hát -> tìm ra chủ đề thông qua topicId
  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false
  });

  // trả ra bài hát ưa thích để hiển thị lên giao diện
  const favoriteSong = await FavoriteSong.findOne({
    userId: "",
    songId: song.id
  });

  // check tồn tại favoriteSong thì trả về true, k thì false
  song["isFavoriteSong"] = favoriteSong ? true : false;

  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    singer: singer,
    topic: topic
  });
};

// [PATCH] /songs/like/:type/:idSong
export const like = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const type: string = req.params.type;

  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active"
  });

  let updateLike = song.like;

  if(type == "yes") {
    updateLike += 1;
  } else {
    updateLike -= 1;
  }

  // update lại lượt like trong database 
  await Song.updateOne({
    _id: idSong
  }, {
    like: updateLike
  });

  res.json({
    code: 200,
    message: "Thành công!",
    like: updateLike
  });
};

// [PATCH] /songs/favorite/:type/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const type: string = req.params.type;

  if(type == "yes") {
    // tìm trong FavoriteSong có tồn tại bài hát có id được gửi lên k, có r thì thôi để đỡ lưu nhiều lần
    const existRecord = await FavoriteSong.findOne({
      userId: "",
      songId: idSong,
    });

    // chưa có thì lưu vào database
    if(!existRecord) {
      const record = new FavoriteSong({
        userId: "",
        songId: idSong,
      });
      await record.save();
    }
  } else {
    // type == "no" -> user muốn xóa bài hát khỏi danh sách ưa thích -> xóa id bài hát khỏi database luôn
    await FavoriteSong.deleteOne({
      userId: "",
      songId: idSong
    });
  }

  res.json({
    code: 200,
    message: "Thành công!"
  });
}

// [PATCH] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;

  const song = await Song.findOne({
    _id: idSong
  });

  const listen: number = song.listen + 1;

  await Song.updateOne({
    _id: idSong
  }, {
    listen: listen
  });

  res.json({
    code: 200,
    message: "Thành công!",
    listen: listen
  });
}