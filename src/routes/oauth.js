const express = require("express");
const { github, githubCallback } = require("../controllers/oauth");
const router = express.Router();

router.route("/github").get(github);
router.route("/github/callback").post(githubCallback);

module.exports = router;
