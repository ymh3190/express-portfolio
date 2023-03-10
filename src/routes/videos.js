const express = require("express");
const multer = require("multer");
const {
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  getUpload,
  uploadVideo,
} = require("../controllers/videos");
const router = express.Router();
const uploader = multer({ dest: "uploads/videos" }).single("video");
const authentication = require("../middleware/authentication");

router.route("/").get(getVideos);
router
  .all(authentication)
  .route("/upload")
  .get(getUpload)
  .post(uploader, uploadVideo);
router.route("/:id(\\d+)").get(authentication, getVideo);
router.route("/:id(\\d+)/update").post(authentication, updateVideo);
router.route("/:id(\\d+)/delete").get(authentication, deleteVideo);

module.exports = router;
