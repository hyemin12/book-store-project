const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bookstore",
  password: process.env.DATABASE_PASSWORD,
});

module.exports = connection;
