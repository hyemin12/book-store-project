const pool = require('../mysql');

const findAll = async () => {
  const sql = 'SELECT category_id as id, category as name FROM category';
  const [rows] = await pool.execute(sql);

  return rows;
};

module.exports = { findAll };
