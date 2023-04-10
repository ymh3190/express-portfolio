const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/users");
const router = express.Router();
const multer = require("multer");
const customAPIStorage = require("../utils/storage");
const uploader = multer({
  storage: customAPIStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
  }),
  limits: { fileSize: 500 * 1024 },
}).single("profilePhoto");

router.route("/:id(\\w{32})").get(getUser);
router.route("/:id(\\w{32})/update").post(uploader, updateUser);
router.route("/:id(\\w{32})/delete").get(deleteUser);
router.route("/logout").get(logout);

module.exports = router;
