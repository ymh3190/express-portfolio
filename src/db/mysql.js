const mysql = require("mysql2/promise");
const mysqlOptions = require("../utils/mysqlOptions");

module.exports = mysql.createPool(mysqlOptions);
