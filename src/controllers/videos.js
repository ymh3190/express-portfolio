import { StatusCodes } from "http-status-codes";
import mysql from "../db/mysql.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import async_ from "../middleware/async.js";
import random from "../utils/randomFill.js";
// import conn from "../utils/ssh.js";

export const getVideos = async_(async (req, res) => {
  const sql = "SELECT * FROM `videos` WHERE `userId` = ?";
  const [results] = await mysql.query(sql, req.session.user.id);
  const videos = results;
  res
    .status(StatusCodes.OK)
    .render("pages/video", { pageTitle: "Videos", videos });
});

export const getVideo = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  const sql = "SELECT * FROM `videos` WHERE `id` = ? AND `userId` = ?";
  const values = [id, req.session.user.id];
  const [results] = await mysql.query(sql, values);
  const video = results[0];
  res
    .status(StatusCodes.OK)
    .render("pages/video", { pageTitle: "Video", videos: null, video });
});

export const updateVideo = async_(async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;

  if (!title || !description) {
    throw new BadRequestError("Provide title and description");
  }
  const sql = "UPDATE `videos` SET title = ?, description = ? WHERE `id` = ?";
  const values = [title, description, id];
  await mysql.query(sql, values);
  res.status(StatusCodes.OK).redirect(`/videos/${id}`);
});

export const deleteVideo = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  let sql = "SELECT path FROM `videos` WHERE `id` = ?";
  const [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "DELETE FROM `videos` WHERE `id` = ?";
  await mysql.query(sql, id);
  res.status(StatusCodes.OK).redirect("/videos");
  // const target = video.path.split("uploads/")[1];
  // const volumePath = `/mnt/volume_sgp1_01/uploads/${target}`;
  // const linkPath = `/var/www/html/uploads/${target}`;
  // conn
  //   .on("ready", () => {
  //     conn.shell((err, stream) => {
  //       if (err) throw err;
  //       stream.on("exit", () => {
  //         conn.end();
  //         res.status(StatusCodes.OK).redirect("/videos");
  //       });
  //       stream.end(`rm ${linkPath} ${volumePath}\nexit\n`);
  //     });
  //   })
  //   .connect({
  //     host: process.env.DROPLETS_HOST,
  //     username: process.env.DROPLETS_USER,
  //     password: process.env.DROPLETS_PASSWORD,
  //   });
});

export const getUpload = (req, res) => {
  res.status(StatusCodes.OK).render("pages/upload", { pageTitle: "Upload" });
};

export const uploadVideo = async_(async (req, res) => {
  const {
    file,
    body: { title, description },
  } = req;

  if (!file || !title || !description) {
    throw new BadRequestError("Provide file, title and description");
  }

  const [results] = await mysql.query(
    "SELECT profilePhoto, name FROM `users` WHERE `id` = ?",
    req.session.user.id
  );
  const { profilePhoto, name } = results[0];
  const sql = `
  INSERT INTO videos(id, path, title, description, userId, userProfilePhoto, userName)
  VALUES(?, ?, ?, ?, ?, ?, ?)`;
  const id = random();
  const values = [
    id,
    file.location,
    title,
    description,
    req.session.user.id,
    profilePhoto,
    name,
  ];
  await mysql.query(sql, values);
  res.status(StatusCodes.CREATED).redirect("/");
});

export const addComment = async_(async (req, res) => {
  const {
    body: { context, videoId },
  } = req;

  if (!context) {
    throw new BadRequestError("Provide context");
  }
  if (!videoId) {
    throw new BadRequestError("Provide videoId");
  }

  let sql = "SELECT id, name FROM `users` WHERE `id` = ?";
  const [results] = await mysql.query(sql, req.session.user.id);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }

  sql = "SELECT id FROM `videos` WHERE `id` = ?";
  const [results_] = await mysql.query(sql, videoId);
  const video = results_[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  sql = `
  INSERT INTO comments(id, context, videoId, userId, userName)
  VALUES(?, ?, ?, ?, ?)`;
  const id = random();
  const values = [id, context, video.id, user.id, user.name];
  await mysql.query(sql, values);
  const data = { comment: context, commentId: id, userName: user.name };
  res.status(StatusCodes.OK).json(data);
});

export const deleteComment = async_(async (req, res) => {
  const {
    body: { commentId },
  } = req;

  const sql = "DELETE FROM `comments` WHERE `id` = ?";
  await mysql.query(sql, commentId);
  res.status(StatusCodes.OK).end();
});

export const addView = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  let sql = "SELECT * FROM `videos` WHERE `id` = ?";
  const [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "UPDATE `videos` SET view = videos.view+1 WHERE `id` = ?";
  await mysql.query(sql, id);
  res.status(StatusCodes.OK).end();
});
