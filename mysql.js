const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
});

module.exports = connection;
