const express = require("express");
const {
  github,
  githubCallback,
  facebook,
  facebookCallback,
} = require("../controllers/oauth");
const router = express.Router();

router.route("/github").get(github);
router.route("/github/callback").get(githubCallback);
router.route("/facebook").get(facebook);
router.route("/facebook/callback").get(facebookCallback);

module.exports = router;
