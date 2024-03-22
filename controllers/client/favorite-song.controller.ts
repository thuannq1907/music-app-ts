import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /favorite-songs/
export const index = async (req: Request, res: Response) => {
  // lấy ra tất cả bài hát ưa thích trong database
  const favoriteSongs = await FavoriteSong.find({
    // userId: "",
    deleted: false
  });

  // từ bài hát ưa thích -> lấy ra id bài hát -> tìm ra t.tin bài hát
  for (const item of favoriteSongs) {
    const infoSong = await Song.findOne({
      _id: item.songId
    });

    // từ t.tin bài hát -> tìm ra t.tin ca sĩ
    const infoSinger = await Singer.findOne({
      _id: infoSong.singerId
    });

    // add t.tin bài hát và t.tin ca sĩ vào bài hát ưa thích
    item["infoSong"] = infoSong;
    item["infoSinger"] = infoSinger;
  }

  res.render("client/pages/favorite-songs/index", {
    pageTitle: "Bài hát yêu thích",
    favoriteSongs: favoriteSongs
  });
};