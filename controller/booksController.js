const { StatusCodes } = require("http-status-codes");

const getSqlQueryResult = require("../utils/getSqlQueryResult");
const handleServerError = require("../utils/handleServerError");

function buildBaseBookQuery(userId) {
  let sql = `
    SELECT books.*,
      (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes
    FROM books
  `;

  if (userId) {
    sql += `,
      (SELECT count(*) FROM bookstore.likes WHERE user_id = ? AND book_id = books.id) AS liked
    `;
  }

  sql += ` LEFT JOIN category ON category.category_id = books.category_id `;

  return sql;
}
const getBooks = async (req, res) => {
  const { categoryId, new: fetchNewBooks, page } = req.query;
  const userId = req.body ? req.body.user_id : null;
  const limit = 8;
  const offset = limit * (page - 1);

  let sql = buildBaseBookQuery(userId);
  const values = userId ? [userId] : [];

  if (categoryId) {
    sql += " WHERE books.category_id = ?";
    values.push(categoryId);
  }

  if (fetchNewBooks) {
    sql += categoryId ? " AND" : " WHERE";
    sql += " published_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()";
  }

  if (page) {
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const getIndividualBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.body ? req.body.user_id : null;

  let sql = buildBaseBookQuery(userId);
  let values = [bookId];

  if (userId) {
    values.unshift(userId);
  }

  sql += " WHERE books.id = ?";

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);
    res.status(StatusCodes.OK).send(rows);
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const getSearchBooks = async (req, res, next) => {
  const { page, query } = req.query;

  let additional = "";

  if (page) {
    const limit = 6;
    const offset = limit * (page - 1);
    additional = ` LIMIT ${limit} OFFSET ${offset}`;
  }

  const sql = `
    SELECT * FROM books 
    WHERE title LIKE CONCAT("%", ?, "%") 
    ${additional}`;

  try {
    const { rows, conn } = await getSqlQueryResult(sql, [query]);
    res.status(StatusCodes.OK).send({ lists: rows });
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

module.exports = {
  getBooks,
  getSearchBooks,
  getIndividualBook,
};
