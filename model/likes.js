const pool = require('../mysql');
const checkDataExistence = require('../utils/checkDataExistence');
const { throwError } = require('../utils/handleError');

const checkLikeExistence = async ({ userId, bookId }) => {
  const sql = 'SELECT * FROM likes WHERE user_id = ? AND book_id = ?';
  const values = [userId, bookId];
  const { isExist } = await checkDataExistence(sql, values);

  return isExist;
};

const addLike = async ({ userId, bookId }) => {
  try {
    const sql = `
      INSERT INTO likes (user_id, book_id) 
      VALUES (?, ?)
    `;
    const values = [userId, bookId];
    const [rows] = await pool.execute(sql, values);
    return rows.affectedRows > 0;
  } catch (error) {
    throwError('좋아요 추가 실패');
  }
};

const deleteLikeDB = async ({ userId, bookId }) => {
  try {
    const sql = `
      DELETE FROM likes
      WHERE user_id = ? AND book_id = ?
    `;
    const values = [userId, bookId];
    const [rows] = await pool.execute(sql, values);
    return rows.affectedRows > 0;
  } catch (error) {
    throwError('좋아요 삭제 실패');
  }
};

module.exports = { checkLikeExistence, addLike, deleteLikeDB };
