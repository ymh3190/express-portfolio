const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const mysql = require("../db/mysql");
const isEmail = require("../utils/isEmail");
const bcrypt = require("bcryptjs");

const getUser = (req, res) => {
  const {
    params: { id },
  } = req;

  mysql.query("select * from users where id=?", id, (err, results) => {
    if (err) throw err;
    const user = results[0];
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .render("pages/error", { msg: "User not found" });
    }
    res.status(StatusCodes.OK).render("pages/user", { pageTitle: "User" });
  });
};

const updateUser = async (req, res) => {
  const {
    params: { id },
    body: { email, name, password },
  } = req;

  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }

  if (!password) {
    throw new BadRequestError("Provide password");
  }

  let sql = "select password from users where id=? and email=?";
  mysql.query(sql, [id, email], async (err, results) => {
    if (err) throw err;
    if (req.session.user.id !== Number(id)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .render("pages/error", { msg: "Forbidden" });
    }
    const user = results[0];
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .render("pages/error", { msg: "User not found" });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .render("pages/error", { msg: "Pasword invalid" });
    }
    sql = "update users set email=?, name=? where id=?";
    mysql.query(sql, [email, name, id], (err, results) => {
      if (err) throw err;
      sql = "select id, email, name from users where id=?";
      mysql.query(sql, id, (err, results) => {
        if (err) throw err;
        const user = results[0];
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .render("pages/error", { msg: "User not found" });
        }
        req.session.user = user;
        res.status(StatusCodes.OK).redirect(`/users/${id}`);
      });
    });
  });
};

const deleteUser = (req, res) => {
  const {
    params: { id },
  } = req;

  mysql.query("delete from users where id=?", id, (err, results) => {
    if (err) throw err;
    const user = results[0];
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .render("pages/error", { msg: "User not found" });
    }
    res.status(StatusCodes.OK).json({ msg: "OK", data: { user } });
  });
};

module.exports = { getUser, updateUser, deleteUser };
