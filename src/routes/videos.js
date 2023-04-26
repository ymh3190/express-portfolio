import express from "express";
import multer from "multer";
import {
  getVideo,
  updateVideo,
  deleteVideo,
  getUpload,
  uploadVideo,
  addComment,
  deleteComment,
  addView,
  getVideos,
} from "../controllers/videos.js";
const router = express.Router();
// const multerS3 = require("../utils/multerS3");
// const uploader = multer({
//   storage: multerS3("videos"),
//   limits: { fileSize: 1000 * 1024 },
// }).single("video");
import customAPIStorage from "../utils/storage.js";
const uploader = multer({
  storage: customAPIStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/videos");
    },
  }),
  limits: { fileSize: 1000 * 1024 },
}).single("video");

router.route("/").get(getVideos);
router.route("/upload").get(getUpload).post(uploader, uploadVideo);
router.route("/:id(\\w{32})").get(getVideo);
router.route("/:id(\\w{32})/update").post(updateVideo);
router.route("/:id(\\w{32})/delete").get(deleteVideo);
router.route("/api/comment").post(addComment);
router.route("/api/comment/delete").post(deleteComment);
router.route("/api/:id(\\w{32})/view").post(addView);

export default router;
