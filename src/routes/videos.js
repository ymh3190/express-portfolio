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
const CustomAPIStorage = require("../utils/storage");
const uploader = multer({
  storage: CustomAPIStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/videos");
    },
  }),
  dest: "uploads/videos",
  limits: { fileSize: 1000 * 1024 },
}).single("video");

router.route("/").get(getVideos);
router.route("/upload").get(getUpload).post(uploader, uploadVideo);
router.route("/:id(\\d+)").get(getVideo);
router.route("/:id(\\d+)/update").post(updateVideo);
router.route("/:id(\\d+)/delete").get(deleteVideo);
router.route("/api/comment").post(addComment);
router.route("/api/comment/delete").post(deleteComment);
router.route("/api/:id(\\d+)/view").post(addView);

module.exports = router;
