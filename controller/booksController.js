const { StatusCodes } = require("http-status-codes");
const conn = require("../mysql");

const getAllBooks = async (req, res) => {
  try {
    const sql = "SELECT * FROM books";
    const [rows] = await (await conn).execute(sql);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "서버 오류" });
  }
};

const filteredRecentBooks = (books) => {
  const newBooksPeriod = new Date();
  newBooksPeriod.setMonth(newBooksPeriod.getMonth() - 1);
  return books.filter((book) => {
    const publishedDate = new Date(book.published_at);
    return publishedDate >= newBooksPeriod;
  });
};

const getCategoryBooks = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const isFilteredRecentBooks = req.query.new;

    const sql =
      "SELECT id, category_id, title, subtitle, summary, author, published_at, price FROM books WHERE category_id = ?";
    const [rows] = await (await conn).execute(sql, [categoryId]);

    if (isFilteredRecentBooks) return res.status(StatusCodes.OK).send({ lists: filteredRecentBooks(rows) });

    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
};

const getSearchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    res.status(StatusCodes.OK).send({ message: "도서 검색", query });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
};

const getIndividualBook = async (req, res, next) => {
  const { bookId } = req.params;
  res.status(StatusCodes.OK).send({ message: "개별 도서 조회" });
};

module.exports = {
  getAllBooks,
  getCategoryBooks,
  getSearchBooks,
  getIndividualBook,
};
