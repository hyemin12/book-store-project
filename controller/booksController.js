const { StatusCodes } = require("http-status-codes");
const conn = require("../mysql");

/** 카테고리 테이블에서 카테고리명을 조인해서 가져오는 SQL문 만드는 함수
 * condition=WHERE 조건문
 * additional=추가할 내용
 */
const generateBookQuery = (condition, additional = "") => {
  if (typeof condition !== "string") {
    throw new Error("Invalid WHERE condition");
  }
  const whereClause = condition ? `WHERE ${condition}` : "";
  return `
    SELECT * FROM books 
    LEFT JOIN category ON category.id = books.category_id
    ${additional}
    ${whereClause}`;
};

// 서버 오류 핸들러
const handleError = (res, error) => {
  console.error(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
};

/** 카테고리별, 신간, 모든 도서를 조회하는 sql문을 만드는 함수
 * categoryId && fetchNewBooks : 카테고리별 신간 조회
 * categoryId: 카테고리별로 조회
 * fetchNewBooks: 신간 조회 (30일)
 * 모두 없다면 모든 도서 조회 *
 */
const queryForBooks = (categoryId, fetchNewBooks) => {
  const categoryIdCondition = "category_id = ?";
  const newBooksCondition = `published_at 
  BETWEEN DATE_SUB(now(), interval 30 DAY) 
  AND NOW()`;

  if (categoryId && fetchNewBooks) {
    return generateBookQuery(`${categoryIdCondition} AND ${newBooksCondition}`);
  } else if (categoryId) {
    return generateBookQuery(categoryIdCondition);
  } else if (fetchNewBooks) {
    return generateBookQuery(newBooksCondition);
  } else {
    return generateBookQuery();
  }
};

const getBooks = async (req, res) => {
  try {
    const { categoryId, new: fetchNewBooks } = req.query;

    const sql = queryForBooks(categoryId, fetchNewBooks);
    const [rows] = await (await conn).execute(sql, [categoryId ? categoryId : null]);

    res.status(StatusCodes.OK).send({ lists: rows });
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
  getBooks,
  getSearchBooks,
  getIndividualBook,
};
