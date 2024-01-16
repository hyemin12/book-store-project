const pool = require('../mysql');

const getConnection = async (conn) => {
  const connection = conn ?? (await pool.getConnection());
  return connection;
};

const releaseConnection = (connection, conn) => {
  if (!conn) {
    connection.release();
  }
};

module.exports = { getConnection, releaseConnection };
