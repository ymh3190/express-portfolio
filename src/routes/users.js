const express = require("express");
const { getUser, updateUser, deleteUser } = require("../controllers/users");
const router = express.Router();

router.route("/:id([0-9a-zA-Z]{32})").get(getUser);
router.route("/update/::id([0-9a-zA-Z]{32})").post(updateUser);
router.route("/delete/::id([0-9a-zA-Z]{32})").get(deleteUser);

module.exports = router;
