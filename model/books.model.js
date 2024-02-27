const pool = require('../mysql');

/** books의 기본 쿼리를 리턴하는 함수
 *  userId가 있으면 유저가 좋아요를 클릭했는지 여부를 확인하고 반환
 */
const buildBaseBookQuery = (userId) => {
  const baseQuery = `
    SELECT SQL_CALC_FOUND_ROWS books.*, category.category AS category_name,
    (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes
    FROM books
    LEFT JOIN category ON category.category_id = books.category_id
  `;

  const userQuery = `
    SELECT SQL_CALC_FOUND_ROWS books.*,category.category AS category_name,
    (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes,
    (SELECT count(*) FROM bookstore.likes WHERE user_id = ? AND book_id = books.id) AS liked
    FROM books
    LEFT JOIN category ON category.category_id = books.category_id
    `;

  return userId ? userQuery : baseQuery;
};

const findBooks = async ({ categoryId, fetchNewBooks, userId, limit, offset }) => {
  let sql = buildBaseBookQuery(userId);
  const values = userId ? [userId] : [];

  if (categoryId) {
    sql += ' WHERE books.category_id = ?';
    values.push(categoryId);
  }
  if (fetchNewBooks) {
    sql += categoryId ? ' AND' : ' WHERE';
    sql += ' published_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()';
  }
  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  const [books] = await pool.execute(sql, values);
  const [[totalCount]] = await pool.execute('SELECT found_rows() as counts');

  return { books, totalCount: totalCount.counts };
};

const findBook = async ({ userId, bookId }) => {
  let sql = buildBaseBookQuery(userId);
  sql += ' WHERE books.id = ?';

  const values = userId ? [userId, bookId] : [bookId];

  const [[book]] = await pool.execute(sql, values);
  return book;
};

const findReviews = async ({ bookId }) => {
  const sql = `
    SELECT 
    users.email AS author, text, rate, reviews.created_at FROM reviews 
    LEFT JOIN users ON reviews.user_id = users.id 
    WHERE book_id = ?`;
  const values = [bookId];

  const [reviews] = await pool.execute(sql, values);
  return reviews;
};

const findBestSeller = async ({ categoryId, bookId }) => {
  const sql = `
    SELECT *,
    (SELECT count(*) FROM likes WHERE likes.book_id = books.id) AS likes
    FROM books 
    WHERE category_id = ? AND id != ?
    ORDER BY likes DESC
    `;
  const values = [categoryId, bookId];

  const [bestSeller] = await pool.execute(sql, values);
  return bestSeller;
};

const findQuery = async ({ query, limit, offset }) => {
  const sql = `
    SELECT SQL_CALC_FOUND_ROWS * FROM books
    WHERE title LIKE CONCAT("%", ?, "%") 
    LIMIT ${limit} OFFSET ${offset}
  `;
  const values = [query];

  const [books] = await pool.execute(sql, values);
  const [[totalCount]] = await pool.execute('SELECT found_rows() as counts');

  return { books, totalCount: totalCount.counts };
};

module.exports = { findBooks, findBook, findReviews, findBestSeller, findQuery };
