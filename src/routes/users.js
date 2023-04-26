import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  logout,
} from "../controllers/users.js";
const router = express.Router();
import multer from "multer";
import multerS3 from "../utils/multerS3.js";
const uploader = multer({
  storage: multerS3("images"),
  limits: { fileSize: 500 * 1024 },
}).single("video");

router.route("/:id(\\w{32})").get(getUser);
router.route("/:id(\\w{32})/update").post(uploader, updateUser);
router.route("/:id(\\w{32})/delete").get(deleteUser);
router.route("/logout").get(logout);

export default router;
