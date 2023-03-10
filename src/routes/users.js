const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/users");
const router = express.Router();
const authentication = require("../middleware/authentication");

router.route("/:id(\\d+)").get(authentication, getUser);
router.route("/:id(\\d+)/update").post(authentication, updateUser);
router.route("/:id(\\d+)/delete").get(authentication, deleteUser);
router.route("/logout").get(authentication, logout);

module.exports = router;
