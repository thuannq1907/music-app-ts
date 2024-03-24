import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/upload.controller";

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.post(
  "/",
  // mặc đinh tinymce để tên là file
  upload.single("file"),
  // up lên cloudinary
  uploadCloud.uploadSingle,
  controller.upload
);

export const uploadRoutes: Router = router;