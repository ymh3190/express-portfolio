const express = require("express");
const {
  getUser,
  postUpdateUser,
  getDeleteUser,
  getLogout,
} = require("../controllers/users");
const router = express.Router();

router.route("/:id(\\d+)").get(getUser);
router.route("/:id(\\d+)/update").post(postUpdateUser);
router.route("/:id(\\d+)/delete").get(getDeleteUser);
router.route("/logout").get(getLogout);

module.exports = router;
