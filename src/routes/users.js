const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  logout,
  github,
} = require("../controllers/users");
const router = express.Router();
const authentication = require("../middleware/authentication");

router.route("/:id(\\d+)").get(authentication, getUser);
router.route("/:id(\\d+)/update").post(authentication, updateUser);
router.route("/:id(\\d+)/delete").get(authentication, deleteUser);
router.route("/logout").get(authentication, logout);
router.route("/github").get(github);

module.exports = router;
