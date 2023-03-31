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
const uploader = multer({
  dest: "uploads/images",
  limits: { fileSize: 500 * 1024 },
}).single("profilePhoto");

router.route("/:id(\\d+)").get(authenticationMiddleware, getUser);
router
  .route("/:id(\\d+)/update")
  .post(authenticationMiddleware, uploader, updateUser);
router.route("/:id(\\d+)/delete").get(authenticationMiddleware, deleteUser);
router.route("/logout").get(authenticationMiddleware, logout);

module.exports = router;
