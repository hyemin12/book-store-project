const pool = require('../mysql');
const { throwError } = require('../utils/handleError');

const findAll = async () => {
  try {
    const sql = 'SELECT * FROM category';
    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    throwError('카테고리 조회 오류');
  }
};

module.exports = { findAll };
