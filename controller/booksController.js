const { StatusCodes } = require("http-status-codes");
const conn = require("../mysql");

// const categoryJoinQuery = `
//   SELECT books.*, category.* FROM books
//   LEFT JOIN category ON category.id = books.category_id
//   WHERE books.id = ?
// `;

const filteredRecentBooks = (books) => {
  const newBooksPeriod = new Date();
  newBooksPeriod.setMonth(newBooksPeriod.getMonth() - 1);
  return books.filter((book) => {
    const publishedDate = new Date(book.published_at);
    return publishedDate >= newBooksPeriod;
  });
};

const getAllBooks = async (req, res) => {
  try {
    if (req.query) {
      const { categoryId, new: isFilteredRecentBooks } = req.query;
      const sql = `SELECT * FROM books WHERE category_id = ?`;
      const [rows] = await (await conn).execute(sql, [categoryId]);

      if (isFilteredRecentBooks) return res.status(StatusCodes.OK).send({ lists: filteredRecentBooks(rows) });

      res.status(StatusCodes.OK).send({ lists: rows });
    } else {
      const sql = "SELECT * FROM books";
      const [rows] = await (await conn).execute(sql);
      res.status(StatusCodes.OK).send({ lists: rows });
    }
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "서버 오류" });
  }
};

const getSearchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    const sql =
      "SELECT id, category_id, title, subtitle, summary, author, published_at, price FROM books WHERE title LIKE CONCAT('%',?,'%')";
    const [rows] = await (await conn).execute(sql, [query]);

    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
};

const getIndividualBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const sql = `SELECT * FROM books 
      LEFT JOIN category ON category.id = books.category_id 
      WHERE books.id = ?`;
    const [rows] = await (await conn).execute(sql, [bookId]);
    res.status(StatusCodes.OK).send(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
};

module.exports = {
  getAllBooks,
  getSearchBooks,
  getIndividualBook,
};
