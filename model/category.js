const pool = require('../mysql');

const findAll = async () => {
  const sql = 'SELECT * FROM category';
  const [rows] = await pool.execute(sql);

  return rows;
};

module.exports = { findAll };
