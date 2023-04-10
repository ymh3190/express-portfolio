const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const mysql = require("../db/mysql");
const isEmail = require("../utils/isEmail");
const bcrypt = require("bcryptjs");
const async_ = require("../middleware/async");

const getUser = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  if (req.session.user.id !== id) {
    throw new ForbiddenError("Forbidden");
  }

  const sql = "SELECT * FROM `users` WHERE `id` = ?";
  const [results] = await mysql.query(sql, id);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(StatusCodes.OK).render("pages/user", { pageTitle: "User", user });
});

const updateUser = async_(async (req, res) => {
  const {
    params: { id },
    body: { email, name, password },
    file,
  } = req;

  if (req.session.user.id !== id) {
    throw new ForbiddenError("Forbidden");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }

  let sql =
    "SELECT password, social FROM `users` WHERE `id` = ? AND `email` = ?";
  let values = [id, email];
  const [results] = await mysql.query(sql, values);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.social) {
    if (!password) {
      throw new BadRequestError("Provide password");
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new BadRequestError("Pasword invalid");
    }
  }

  if (!file) {
    sql = "UPDATE `users` SET email = ?, name = ? WHERE `id` = ?";
    values = [email, name, id];
    await mysql.query(sql, values);
  } else {
    sql =
      "UPDATE `users` SET email = ?, name = ?, profilePhoto = ? WHERE `id` = ?";
    values = [email, name, file.path, id];
    await mysql.query(sql, values);
    sql = "UPDATE `videos` SET userProfilePhoto = ? WHERE `userId` = ?";
    values = [file.path, id];
    await mysql.query(sql, values);
  }

  sql = "SELECT * FROM `users` WHERE `id` = ?";
  const [results_] = await mysql.query(sql, id);
  const user_ = results_[0];
  if (!user_) {
    throw new NotFoundError("User not found");
  }
  req.session.user = user_;
  delete req.session.user.password;
  res.status(StatusCodes.OK).redirect(`/users/${id}`);
});

const deleteUser = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  if (req.session.user.id !== id) {
    throw new ForbiddenError("Forbidden");
  }

  await mysql.query("DELETE FROM `videos` WHERE `userId` = ?", id);
  await mysql.query("DELETE FROM `comments` WHERE `userId` = ?", id);
  const [results] = await mysql.query("DELETE FROM `users` WHERE `id` = ?", id);
  if (!results.affectedRows) {
    throw new NotFoundError("User not found");
  }
  req.session.destroy();
  res.status(StatusCodes.OK).redirect("/");
});

const logout = (req, res) => {
  req.session.destroy();
  res.status(StatusCodes.OK).redirect("/");
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  logout,
};
