const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/users");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");

router.route("/:id(\\d+)").get(authenticationMiddleware, getUser);
router.route("/:id(\\d+)/update").post(authenticationMiddleware, updateUser);
router.route("/:id(\\d+)/delete").get(authenticationMiddleware, deleteUser);
router.route("/logout").get(authenticationMiddleware, logout);

module.exports = router;
