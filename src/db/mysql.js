const mysql = require("mysql");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "",
  database: "test",
});
