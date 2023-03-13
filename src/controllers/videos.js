const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const { BadRequestError, NotFoundError } = require("../errors");
const async_ = require("../middleware/async");

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

  const sql =
    "insert into videos(path, title, description, userId) values(?,?,?,?)";
  await mysql.query(sql, [file.path, title, description, req.session.user.id]);
  res.status(StatusCodes.CREATED).redirect("/videos/upload");
});

const addComment = async_(async (req, res) => {
  const {
    body: { comment: context, videoId },
  } = req;

  if (!context) {
    throw new BadRequestError("Provide context");
  }
  if (!videoId) {
    throw new BadRequestError("Provide videoId");
  }

  let sql = "select id from users where id=?";
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

  sql = "insert into comments(context, videoId, userId) values(?,?,?)";
  const results__ = await mysql.query(sql, [context, video.id, user.id]);
  const commentId = results__[0].insertId;

  sql = "update videos set commentId=? where id=?";
  await mysql.query(sql, [commentId, video.id]);
  res.status(StatusCodes.OK).json({ comment: context, commentId });
});

const deleteComment = async_(async (req, res) => {
  const {
    body: { commentId },
  } = req;

  const sql = "delete from comments where id=?";
  await mysql.query(sql, commentId);
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
};
