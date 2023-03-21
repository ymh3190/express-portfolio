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
  addView,
} = require("../controllers/videos");
const router = express.Router();
const uploader = multer({ dest: "uploads/videos" }).single("video");
const authenticationMiddleware = require("../middleware/authentication");

router.route("/").get(getVideos);
router
  .route("/upload")
  .all(authenticationMiddleware)
  .get(getUpload)
  .post(uploader, uploadVideo);
router.route("/:id(\\d+)").get(authenticationMiddleware, getVideo);
router.route("/:id(\\d+)/update").post(authenticationMiddleware, updateVideo);
router.route("/:id(\\d+)/delete").get(authenticationMiddleware, deleteVideo);
router.route("/api/comment").post(addComment);
router.route("/api/comment/delete").post(deleteComment);
router.route("/api/:id(\\d+)/view").post(addView);

module.exports = router;
