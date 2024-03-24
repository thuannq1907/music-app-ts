import { Request, Response } from "express";

// [GET] /admin/upload/
export const upload = async (req: Request, res: Response) => {
  console.log(req.body);

  // trả ra link ảnh cho bên tinymce theo format location: đường link ảnh để nó insert 
  res.json({
    location: req.body.file
  });
};