const { StatusCodes } = require("http-status-codes");
const getSqlQueryResult = require("../utils/getSqlQueryResult");
const handleServerError = require("../utils/handleServerError");

const getBooks = async (req, res) => {
  const { categoryId, new: fetchNewBooks, page } = req.query;

  const limit = 8;
  const offset = limit * (page - 1);

  let sql = "SELECT * FROM books";
  const values = [];

  if (categoryId) {
    sql += " WHERE category_id = ?";
    values.push(categoryId);

    if (fetchNewBooks) {
      sql += " AND published_at BETWEEN DATE_SUB(now(), interval 30 DAY) AND NOW()";
    }
  } else if (fetchNewBooks) {
    sql += " WHERE published_at BETWEEN DATE_SUB(now(), interval 30 DAY) AND NOW()";
  }

  if (page) {
    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);
  }

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const getSearchBooks = async (req, res, next) => {
  const { page, query } = req.query;

  let limit = null;
  let offset = null;
  let additional = "";
  let values = [query];

  if (page) {
    limit = 6;
    offset = limit * (page - 1);
    additional = "LIMIT ? OFFSET ?";
    values = [query, parseInt(limit, 10), parseInt(offset, 10)];
  }

  const sql = `
    SELECT * FROM books 
    WHERE title LIKE CONCAT("%", ?, "%") 
    ${additional}`;

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const getIndividualBook = async (req, res, next) => {
  const { bookId } = req.params;

  const sql = `SELECT * from books 
    LEFT JOIN category ON category.id = books.category_id 
    WHERE books.id = ?`;

  try {
    const { rows, conn } = await getSqlQueryResult(sql, [bookId]);
    res.status(StatusCodes.OK).send(rows);
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
