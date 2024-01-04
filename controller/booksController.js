const { StatusCodes } = require("http-status-codes");
const getSqlQueryResult = require("../utils/getSqlQueryResult");
const handleServerError = require("../utils/handleServerError");

// MySQL은 LIMIT 및 OFFSET 절에서 바인딩 매개변수를 지원하지 않습니다. 그래서 이러한 오류가 발생하는 것입니다. 따라서, 바인딩 매개변수 대신 직접 값을 쿼리에 삽입하는 방식으로 해결해야 합니다.

// 하지만 직접 값을 쿼리에 삽입하는 경우 SQL 인젝션 공격에 취약해질 수 있으므로, 반드시 값을 검증하고 안전하게 변환해야 합니다.

// 아래는 안전하게 LIMIT과 OFFSET 값을 쿼리에 삽입하는 방법입니다:
// const limit = 6;
// const offset = limit * (page - 1);

// // 숫자로 변환하고, NaN이거나 음수인 경우 기본값으로 설정
// const safeLimit = Number.isNaN(limit) || limit < 0 ? 10 : limit;
// const safeOffset = Number.isNaN(offset) || offset < 0 ? 0 : offset;

// const sql = `
//     SELECT * FROM books
//     WHERE title LIKE CONCAT("%", ?, "%")
//     LIMIT ${safeLimit} OFFSET ${safeOffset}`;

// const { rows, conn } = await getSqlQueryResult(sql, ['모던']);

const getBooks = async (req, res) => {
  const { categoryId, new: fetchNewBooks, page } = req.query;

  const limit = 8;
  const offset = limit * (page - 1);

  let sql = "SELECT * FROM books ";
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
    sql += `LIMIT ${limit} OFFSET ${offset}`;
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
