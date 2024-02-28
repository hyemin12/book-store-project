const pool = require('../mysql');

const fetchConnection = async (conn) => {
  const connection = conn ?? (await pool.getConnection());
  return connection;
};

const releaseConnection = (connection, conn) => {
  if (!conn) {
    connection.release();
  }
};

module.exports = { getConnection: fetchConnection, releaseConnection };
