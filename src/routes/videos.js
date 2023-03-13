const express = require("express");
const multer = require("multer");
const {
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  getUpload,
  uploadVideo,
  addComment,
  deleteComment,
} = require("../controllers/videos");
const router = express.Router();
const uploader = multer({ dest: "uploads/videos" }).single("video");
const authentication = require("../middleware/authentication");

router.route("/").get(getVideos);
router
  .route("/upload")
  .all(authentication)
  .get(getUpload)
  .post(uploader, uploadVideo);
router.route("/:id(\\d+)").get(authentication, getVideo);
router.route("/:id(\\d+)/update").post(authentication, updateVideo);
router.route("/:id(\\d+)/delete").get(authentication, deleteVideo);
router.route("/api/comment").post(addComment);
router.route("/api/comment/delete").post(deleteComment);

module.exports = router;
