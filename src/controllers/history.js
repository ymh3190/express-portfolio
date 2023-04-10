const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const async_ = require("../middleware/async");
const { NotFoundError } = require("../errors");

const getHistories = async_(async (req, res) => {
  const sql = "SELECT * FROM `histories` WHERE `userId` = ?";
  const [results] = await mysql.query(sql, req.session.user.id);
  const histories = results;
  res
    .status(StatusCodes.OK)
    .render("pages/history", { pageTitle: "History", histories });
});

const addHistory = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  let sql =
    "SELECT id, path, title, description, userName, view FROM `videos` WHERE `id` = ?";
  let [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "SELECT * FROM `histories` WHERE `userId` = ? AND `videoId` = ?";
  [results] = await mysql.query(sql, [req.session.user.id, video.id]);
  const history = results[0];
  if (!history) {
    sql =
      "INSERT INTO `histories`(userId, videoId, path, userName, title, description, view) VALUES(?, ?, ?, ?, ?, ?, ?)";
    const values = [
      req.session.user.id,
      video.id,
      video.path,
      video.userName,
      video.title,
      video.description,
      video.view,
    ];
    await mysql.query(sql, values);
  }
  res.status(StatusCodes.OK).end();
});

module.exports = { getHistories, addHistory };
