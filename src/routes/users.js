const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/users");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");
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

router.route("/:id(\\w{32})").get(authenticationMiddleware, getUser);
router
  .route("/:id(\\w{32})/update")
  .post(authenticationMiddleware, uploader, updateUser);
router.route("/:id(\\w{32})/delete").get(authenticationMiddleware, deleteUser);
router.route("/logout").get(authenticationMiddleware, logout);

module.exports = router;
