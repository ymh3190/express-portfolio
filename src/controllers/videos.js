const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const { BadRequestError } = require("../errors");
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

module.exports = {
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  getUpload,
  uploadVideo,
};
