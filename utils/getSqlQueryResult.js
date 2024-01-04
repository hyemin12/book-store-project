const mysql = require("../mysql");

const getSqlQueryResult = async (sql, values, callback) => {
  console.log(values);
  const conn = await mysql.getConnection();
  const [rows] = await conn.execute(sql, values);
  return { conn, rows };
};

module.exports = getSqlQueryResult;