const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const pool = require('../mysql');

const { handleError } = require('../utils/handleError');

/** 도서 조회
 * @param category_id: 카테고리별로 조회할 때 사용
 * @param new: 신간을 조회할 때 사용
 * @param page: 페이지 (입력하지 않으면 기본값으로 1 설정)
 * @param limit: 전달받을 개수 (입력하지 않으면 기본값으로 8 설정)
 */
const getBooks = async (req, res) => {
  const { categoryId, new: fetchNewBooks, page, limit } = camelcaseKeys(req.query);

  const userId = req.user?.id;

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

  // 페이징 추가
  const { computedLimit, computedPage, offset } = calcPagination(page, limit);
  sql += ` ${computedLimit} OFFSET ${offset}`;

  try {
    const [rows] = await pool.execute(sql, values);
    const [[totalCount]] = await pool.execute('SELECT found_rows() as counts');
    const result = { lists: rows, pagenation: { current_page: computedPage, total_count: totalCount.counts } };
    res.status(StatusCodes.OK).send(result);
  } catch (err) {
    console.log(err);
    handleError(res, err);
  }
};

/** 개별 도서 조회 */
const getIndividualBook = async (req, res) => {
  const { bookId } = camelcaseKeys(req.params);

  const userId = req.user?.id;

  let sql = buildBaseBookQuery(userId);
  const values = [bookId];

  if (userId) {
    values.unshift(userId);
  }

  sql += ' WHERE books.id = ?';

  try {
    const [rows] = await pool.execute(sql, values);
    res.status(StatusCodes.OK).send(rows);
  } catch (err) {
    handleError(res, err);
  }
};

/** 도서 검색 */
const getSearchBooks = async (req, res, next) => {
  const { page, limit, query } = req.query;

  const { computedLimit, computedPage, offset } = calcPagination(page, limit);

  const sql = `
    SELECT * FROM books 
    WHERE title LIKE CONCAT("%", ?, "%") 
    LIMIT ${computedLimit} OFFSET ${offset}`;

  try {
    const [rows] = await pool.execute(sql, [query]);
    const [[totalCount]] = await pool.execute('SELECT found_rows() as counts');
    const result = { lists: rows, pagenation: { current_page: computedPage, total_count: totalCount.counts } };
    res.status(StatusCodes.OK).send(result);
  } catch (err) {
    handleError(res, err);
  }
};

/** books의 기본 쿼리를 리턴하는 함수
 *  userId가 있으면 유저가 좋아요를 클릭했는지 여부를 확인하고 반환
 */
const buildBaseBookQuery = (userId) => {
  let sql = `
    SELECT SQL_CALC_FOUND_ROWS books.*,
    (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes
    FROM books
    LEFT JOIN category ON category.category_id = books.category_id
  `;

  if (userId) {
    sql = `
    SELECT SQL_CALC_FOUND_ROWS books.*,
    (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes,
    (SELECT count(*) FROM bookstore.likes WHERE user_id = ? AND book_id = books.id) AS liked
    FROM books
    LEFT JOIN category ON category.category_id = books.category_id
    `;
  }

  return sql;
};

/** 페이지네이션 계산 함수
 * @param {number} page - 현재 페이지
 * @param {number} limit - 페이지당 아이템 수
 * @return {object} - 계산된 limit과 offset을 포함하는 객체*/
const calcPagination = (page, limit) => {
  const computedPage = page || 1;
  const computedLimit = limit || 6;
  const offset = computedLimit * (computedPage - 1);

  return { computedLimit, computedPage, offset };
};

module.exports = {
  getBooks,
  getSearchBooks,
  getIndividualBook
};
