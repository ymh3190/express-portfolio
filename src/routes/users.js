const express = require("express");
const { getUser, updateUser, deleteUser } = require("../controllers/users");
const router = express.Router();

router.route("/:id(\\d+)").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
