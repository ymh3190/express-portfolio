const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");

const getUser = (req, res) => {
  const {
    params: { id },
  } = req;

  mysql.query("select * from users where id=?", id, (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: error handler
    // if(!user) throw new
    res.status(StatusCodes.OK).json({ msg: "OK", data: { user } });
  });
};

const updateUser = (req, res) => {
  const {
    params: { id },
  } = req;

  // TODO: find and update at the same time
  mysql.query("update users set name='a' where id=?", id, (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: error handler
    // if(!user) throw new
  });

  mysql.query("select * from users where id=?", id, (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: error handler
    // if(!user) throw new
    res.status(StatusCodes.OK).json({ msg: "OK", data: { user } });
  });
};

const deleteUser = (req, res) => {
  const {
    params: { id },
  } = req;

  mysql.query("delete from users where id=?", id, (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: error handler
    // if(!user) throw new
    res.status(StatusCodes.OK).json({ msg: "OK", data: { user } });
  });
};

module.exports = { getUser, updateUser, deleteUser };
