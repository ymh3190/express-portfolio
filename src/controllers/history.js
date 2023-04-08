const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const async_ = require("../middleware/async");
const { NotFoundError } = require("../errors");

const getHistories = async_(async (req, res) => {
  const sql = "select * from histories where userId=?";
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
    "select id, path, title, description, userName, view from videos where id=?";
  let [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "select * from histories where userId=? and videoId=?";
  [results] = await mysql.query(sql, [req.session.user.id, video.id]);
  const history = results[0];
  if (!history) {
    sql =
      "insert into histories(userId, videoId, path, userName, title, description, view) values(?,?,?,?,?,?,?)";
    await mysql.query(sql, [
      req.session.user.id,
      video.id,
      video.path,
      video.userName,
      video.title,
      video.description,
      video.view,
    ]);
  }
  res.status(StatusCodes.OK).end();
});

module.exports = { getHistories, addHistory };
