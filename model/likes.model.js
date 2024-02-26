const pool = require('../mysql');
const checkDataExistence = require('../utils/checkDataExistence');

const checkLikeExistence = async ({ userId, bookId }) => {
  const sql = 'SELECT * FROM likes WHERE user_id = ? AND book_id = ?';
  const values = [userId, bookId];
  const { isExist } = await checkDataExistence(sql, values);

  return isExist;
};

const addLike = async ({ userId, bookId }) => {
  const sql = `
      INSERT INTO likes (user_id, book_id) 
      VALUES (?, ?)
    `;
  const values = [userId, bookId];

  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows > 0;
};

const deleteLikeDB = async ({ userId, bookId }) => {
  const sql = `
      DELETE FROM likes
      WHERE user_id = ? AND book_id = ?
    `;
  const values = [userId, bookId];

  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows > 0;
};

module.exports = { checkLikeExistence, addLike, deleteLikeDB };
