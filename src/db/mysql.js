const mysql = require("mysql2/promise");
const getOptions = require("../utils/getOptions");

module.exports = mysql.createPool(getOptions());
