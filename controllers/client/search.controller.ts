import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convert-to-slug.helper";

// [GET] /search/result
export const result = async (req: Request, res: Response) => {
  const keyword: string = `${req.query.keyword}`;

  let songs = [];

  if(keyword) {
    // tìm theo keyword user nhập
    const keywordRegex = new RegExp(keyword, "i");

    // tìm theo slug
    const slug = convertToSlug(keyword);
    const keywordSlugRegex = new RegExp(slug, "i");

    songs = await Song.find({
      // $or -> tìm kiếm theo title hoặc slug, bỏ $or thì có nghĩa là tìm kiểm theo cả 2 tiêu chí
      $or: [
        { title: keywordRegex },
        { slug: keywordSlugRegex },
      ]
    });

    if(songs.length > 0) {
      // lấy ra t.tin ca sĩ từ bài hát
      for (const song of songs) {
        const infoSinger = await Singer.findOne({
          _id: song.singerId,
          deleted: false
        });

        // add t.tin ca sĩ vào bài hát
        song["infoSinger"] = infoSinger;
      }
    }
  }

  res.render("client/pages/search/result", {
    pageTitle: `Kết quả: ${keyword}`,
    keyword: keyword,
    songs: songs
  });
};