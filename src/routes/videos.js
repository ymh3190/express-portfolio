const express = require("express");
const multer = require("multer");
const {
  getVideo,
  updateVideo,
  deleteVideo,
  getUpload,
  uploadVideo,
  addComment,
  deleteComment,
  addView,
  getVideos,
} = require("../controllers/videos");
const router = express.Router();
// const customAPIStorage = require("../utils/storage");
const multerS3 = require("../utils/multerS3");

const uploader = multer({
  storage: multerS3("videos"),
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

module.exports = router;
