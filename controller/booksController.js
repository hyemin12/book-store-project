const { StatusCodes } = require("http-status-codes");
const conn = require("../mysql");

/** 카테고리 테이블에서 카테고리명을 조인해서 가져오는 SQL문 만드는 함수
 * condition:WHERE 조건문
 * additionalJoin: 추가로 JOIN할 내용
 */
const generateBookQuery = (condition, additionalJoin = "") => {
  if (typeof condition !== "string") {
    throw new Error("Invalid WHERE condition");
  }
  const whereClause = condition ? `WHERE ${condition}` : "";
  return `
    SELECT * FROM books 
    LEFT JOIN category ON category.id = books.category_id
    ${additionalJoin}
    ${whereClause}`;
};

const filteredRecentBooks = (books) => {
  const MONTHS_TO_SUBTRACT = 1;
  const newBooksPeriod = new Date();
  newBooksPeriod.setMonth(newBooksPeriod.getMonth() - MONTHS_TO_SUBTRACT);

  return books.filter((book) => {
    const publishedDate = new Date(book.published_at);
    return publishedDate >= newBooksPeriod;
  });
};

// 서버 오류 핸들러
const handleError = (res, error) => {
  console.error(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
};

const getAllBooks = async (req, res) => {
  try {
    if (req.query) {
      const { categoryId, new: isFilteredRecentBooks } = req.query;

      let condition = "";
      let params = [];

      if (categoryId) {
        condition = "category_id = ?";
        params.push(condition);
      }
      const sql = generateBookQuery(condition);
      const [rows] = await (await conn).execute(sql, params);

      if (isFilteredRecentBooks) return res.status(StatusCodes.OK).send({ lists: filteredRecentBooks(rows) });

      res.status(StatusCodes.OK).send({ lists: rows });
    } else {
      const sql = generateBookQuery();
      const [rows] = await (await conn).execute(sql);

      res.status(StatusCodes.OK).send({ lists: rows });
    }
  } catch (err) {
    handleError(res, err);
  }
};

const getSearchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;

    const condition = 'title LIKE CONCAT("%", ?, "%")';
    const sql = generateBookQuery(condition);
    const [rows] = await (await conn).execute(sql, [query]);

    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleError(res, err);
  }
};

const getIndividualBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const condition = "books.id = ?";
    const sql = generateBookQuery(condition);
    const [rows] = await (await conn).execute(sql, [bookId]);

    res.status(StatusCodes.OK).send(rows[0]);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getAllBooks,
  getSearchBooks,
  getIndividualBook,
};
