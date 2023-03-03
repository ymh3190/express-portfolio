const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "",
  database: "test",
});
