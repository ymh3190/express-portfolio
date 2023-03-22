const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const async_ = require("../middleware/async");

const getHistories = async_(async (req, res) => {
  let sql = "select * from histories where userId=?";
  let [results] = await mysql.query(sql, req.session.user.id);
  for (const result of results) {
    sql = "select * from videos where id=?";
    const [result_] = await mysql.query(sql, result.videoId);
    const video = result_[0];
    console.log(video);
  }
});

const addHistory = async_(async (req, res) => {
  const {
    params: { id },
  } = req;
  let sql = "select id from videos where id=?";
  let [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "select id from users where id=?";
  [results] = await mysql.query(sql, req.session.user.id);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }
  sql = "select * from histories where userId=? and videoId=?";
  [results] = await mysql.query(sql, [user.id, video.id]);
  const history = results[0];
  if (!history) {
    sql = "insert into histories(userId, videoId) values(?,?)";
    await mysql.query(sql, [user.id, video.id]);
  }
  res.status(StatusCodes.OK).end();
});

module.exports = { getHistories, addHistory };
