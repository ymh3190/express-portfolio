const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const { BadRequestError, NotFoundError } = require("../errors");
const async_ = require("../middleware/async");
const randomFill = require("../utils/randomFill");

const getVideos = async_(async (req, res) => {
  const sql = "select * from videos where userId=?";
  const [results] = await mysql.query(sql, req.session.user.id);
  const videos = results;
  res
    .status(StatusCodes.OK)
    .render("pages/video", { pageTitle: "Videos", videos });
});

const getVideo = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  const sql = "select * from videos where id=? and userId=?";
  const [results] = await mysql.query(sql, [id, req.session.user.id]);
  const video = results[0];
  res
    .status(StatusCodes.OK)
    .render("pages/video", { pageTitle: "Video", videos: null, video });
});

const updateVideo = async_(async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;

  if (!title || !description) {
    throw new BadRequestError("Provide title and description");
  }
  const sql = "update videos set title=?, description=? where id=?";
  await mysql.query(sql, [title, description, id]);
  res.status(StatusCodes.OK).redirect(`/videos/${id}`);
});

const deleteVideo = async_(async (req, res) => {
  const {
    params: { id },
  } = req;
  const sql = "delete from videos where id=?";
  await mysql.query(sql, id);
  const sql_ = "delete from histories where videoId=?";
  await mysql.query(sql_, id);
  res.status(StatusCodes.OK).redirect("/videos");
});

const getUpload = (req, res) => {
  res.status(StatusCodes.OK).render("pages/upload", { pageTitle: "Upload" });
};

const uploadVideo = async_(async (req, res) => {
  const {
    file,
    body: { title, description },
  } = req;

  if (!file || !title || !description) {
    throw new BadRequestError("Provide file, title and description");
  }

  const [results] = await mysql.query(
    "select profilePhoto, name from users where id=?",
    req.session.user.id
  );
  const { profilePhoto, name } = results[0];

  const inserInto =
    "insert into videos(id, path, title, description, userId, userProfilePhoto, userName)";
  const values = "values(?, ?, ?, ?, ?, ?, ?)";
  const sql = `${inserInto} ${values}`;
  await mysql.query(sql, [
    randomFill(),
    file.path,
    title,
    description,
    req.session.user.id,
    profilePhoto,
    name,
  ]);
  res.status(StatusCodes.CREATED).redirect("/");
});

const addComment = async_(async (req, res) => {
  const {
    body: { context, videoId },
  } = req;

  if (!context) {
    throw new BadRequestError("Provide context");
  }
  if (!videoId) {
    throw new BadRequestError("Provide videoId");
  }

  let sql = "select id, name from users where id=?";
  const [results] = await mysql.query(sql, req.session.user.id);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }

  sql = "select id from videos where id=?";
  const [results_] = await mysql.query(sql, videoId);
  const video = results_[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  sql =
    "insert into comments(context, videoId, userId, userName) values(?, ?, ?, ?)";
  const results__ = await mysql.query(sql, [
    context,
    video.id,
    user.id,
    user.name,
  ]);
  const { insertId: commentId } = results__[0];

  res
    .status(StatusCodes.OK)
    .json({ comment: context, commentId, userName: user.name });
});

const deleteComment = async_(async (req, res) => {
  const {
    body: { commentId },
  } = req;

  const sql = "delete from comments where id=?";
  await mysql.query(sql, commentId);
  res.status(StatusCodes.OK).end();
});

const addView = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  let sql = "select * from videos where id=?";
  const [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "update videos set view=videos.view+1 where id=?";
  await mysql.query(sql, id);
  res.status(StatusCodes.OK).end();
});

module.exports = {
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  getUpload,
  uploadVideo,
  addComment,
  deleteComment,
  addView,
};
