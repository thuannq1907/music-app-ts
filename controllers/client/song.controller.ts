import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

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