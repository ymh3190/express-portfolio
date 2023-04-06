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
const customAPIStorage = require("../utils/storage");
const uploader = multer({
  storage: process.env.NODE_ENV
    ? customAPIStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/videos");
        },
      })
    : undefined,
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
