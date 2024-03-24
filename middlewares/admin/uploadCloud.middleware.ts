import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
// End cloudinary

const streamUpload = (buffer: any) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToCloudinary = async (buffer: any) => {
  let result = await streamUpload(buffer);
  return result["url"];
}

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await uploadToCloudinary(req["file"].buffer);
    req.body[req["file"].fieldname] = result;
  } catch (error) {
    console.log(error);
  }

  next();
};

export const uploadFields = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // lặp qua 2 key avatar và audio, là 1 mảng các object
    for (const key in req["files"]) {
      // add 2 key avatar và audio vào req.body, mới đầu cho mảng rỗng sau đó mới push link vào
      req.body[key] = [];

      // lặp qua các thành phần có trong 2 key avatar và audio để lấy mã buffer
      const array = req["files"][key];
      for (const item of array) {
        try {
          // chuyển mã buffer vào Cloudinary để lấy link
          const result = await uploadToCloudinary(item.buffer);
          // push vào mảng rỗng vừa tạo phía trên
          req.body[key].push(result);
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  next();
};