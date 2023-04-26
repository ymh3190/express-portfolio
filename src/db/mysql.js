import mysql from "mysql2/promise";
import { mysqlOptions } from "../utils/mysqlOptions.js";

export default mysql.createPool(mysqlOptions);
