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

  if (req.session.user.id !== Number(id)) {
    throw new ForbiddenError("Forbidden");
  }

  const sql = "select * from users where id=?";
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

  if (req.session.user.id !== Number(id)) {
    throw new ForbiddenError("Forbidden");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }

  let sql = "select password, social from users where id=? and email=?";
  const [results] = await mysql.query(sql, [id, email]);
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
    sql = "update users set email=?, name=? where id=?";
    await mysql.query(sql, [email, name, id]);
  } else {
    sql = "update users set email=?, name=?, profilePhoto=? where id=?";
    await mysql.query(sql, [email, name, file.path, id]);
    sql = "update videos set userProfilePhoto=? where userId=?";
    await mysql.query(sql, [file.path, id]);
  }

  sql = "select * from users where id=?";
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

  if (req.session.user.id !== Number(id)) {
    throw new ForbiddenError("Forbidden");
  }

  await mysql.query("delete from videos where userId=?", id);
  await mysql.query("delete from comments where userId=?", id);
  const [results] = await mysql.query("delete from users where id=?", id);
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
