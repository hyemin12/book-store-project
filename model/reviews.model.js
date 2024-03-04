const pool = require('../mysql');

const findReviews = async ({ bookId }) => {
  const sql = `
    SELECT 
    users.email AS user_name, content, score, reviews.created_at FROM reviews 
    LEFT JOIN users ON reviews.user_id = users.id 
    WHERE book_id = ?`;
  const values = [bookId];

  const [rows] = await pool.execute(sql, values);
  return rows;
};

const createReview = async ({ bookId, content, createdAt, score, userId }) => {
  const sql = `
  INSERT INTO reviews
  (book_id,content,created_at,score,user_id)
  VALUES (?,?,?,?,?)
  `;
  const values = [bookId, content, createdAt, score, userId];
  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows;
};

module.exports = { findReviews, createReview };
