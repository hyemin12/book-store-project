const { StatusCodes } = require("http-status-codes");
const conn = require("../mysql");

/** 카테고리 테이블에서 카테고리명을 조인해서 가져오는 SQL문 만드는 함수
 * condition=WHERE 조건문
 * additional=추가할 내용
 */
const generateBookQuery = (condition, pagenation) => {
  const whereClause = condition ? `WHERE ${condition}` : "";
  const limitOffsetClause = pagenation ? "LIMIT ? OFFSET ?" : "";
  return `
    SELECT * FROM books 
    LEFT JOIN category ON category.id = books.category_id
    ${whereClause} 
    ${limitOffsetClause};`;
};

// 서버 오류 핸들러
const handleError = (res, error) => {
  console.error(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
};

const executeQuery = async (res, sql, values) => {
  try {
    console.log(sql, values);
    const [rows] = await (await conn).execute(sql, values);

    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleError(res, err);
  }
};

/** 카테고리별, 신간, 모든 도서를 조회하는 sql문을 만드는 함수
 * categoryId && fetchNewBooks : 카테고리별 신간 조회
 * categoryId: 카테고리별로 조회
 * fetchNewBooks: 신간 조회 (30일)
 * 모두 없다면 모든 도서 조회
 */
const queryForBooks = (categoryId, fetchNewBooks, page) => {
  const categoryIdCondition = "category_id = ?";
  const newBooksCondition = `published_at 
  BETWEEN DATE_SUB(now(), interval 30 DAY) 
  AND NOW()`;
  const pageCondition = page ? "LIMIT ? OFFSET ?" : "";
  let sql = [];

  if (categoryId && fetchNewBooks) {
    sql.push(`${categoryIdCondition} AND ${newBooksCondition}`, pageCondition);
  } else if (categoryId) {
    sql.push(categoryIdCondition, pageCondition);
  } else if (fetchNewBooks) {
    sql.push(newBooksCondition, pageCondition);
  } else {
    return generateBookQuery(undefined, pageCondition);
  }
};

/** sql values의 undefined인 값들을 제거하는 함수 */
const removeUndefined = (values) => {
  return values.filter((v) => v !== undefined && v !== null);
};

const getBooks = async (req, res) => {
  try {
    const { categoryId, new: fetchNewBooks, page, limit } = req.query;
    const offset = page ? limit * (page - 1) : undefined;
    const parseIntLimit = limit ? parseInt(limit) : undefined;

    const sql = queryForBooks(categoryId, fetchNewBooks, page);
    const values = removeUndefined([categoryId, fetchNewBooks, parseIntLimit, offset]);
    console.log(values);
    executeQuery(res, sql, values);
  } catch (err) {
    handleError(res, err);
  }
};

const getSearchBooks = async (req, res, next) => {
  try {
    const { page, limit, query } = req.query;

    const offset = page ? limit * (page - 1) : undefined;
    const additional = page ? "LIMIT ? OFFSET ?" : "";
    const condition = 'title LIKE CONCAT("%", ?, "%")';

    const sql = generateBookQuery(condition, additional);
    const values = removeUndefined([query, limit, offset]);
    console.log(sql, values);
    executeQuery(res, sql, values);
  } catch (err) {
    handleError(res, err);
  }
};

const getIndividualBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const condition = "books.id = ?";
    const sql = generateBookQuery(condition);

    executeQuery(res, sql, [bookId]);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getBooks,
  getSearchBooks,
  getIndividualBook,
};
