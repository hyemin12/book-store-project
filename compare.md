## 생각해 볼 내용

### #가독성을 위해 sql문 전체 작성 vs 공통 로직 모듈화

- SQL 쿼리가 그 자체로 복잡하지 않으며, 각 함수에서 약간씩 변형되어 사용되고 있습니다.
- 쿼리의 전체적인 구조를 유지하면서 중복을 줄일 수 있는 방법을 찾는 것이 좋습니다.
- 예를 들어, 공통된 쿼리 구조를 생성하는 함수를 만들고, 조건에 따라서만 변형되는 부분을 추가하는 방식입니다.
- 중복된 로직을 줄이면 좋은점 : 유지보수, 버그감소, 확장성, 테스트 용이성

```js
// 가독성을 위해 sql문 전체 작성
const { StatusCodes } = require("http-status-codes");

const getSqlQueryResult = require("../utils/getSqlQueryResult");
const handleServerError = require("../utils/handleServerError");

const getBooks = async (req, res) => {
  const { categoryId, new: fetchNewBooks, page } = req.query;
  const userId = req.body ? req.body.user_id : null;

  const limit = 8;
  const offset = limit * (numberPage - 1);

  let sql = `SELECT *,
    (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes 
    FROM books `;
  const values = userId ? [userId] : [];

  if (userId) {
    sql = `SELECT *,
           (SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes,
           (SELECT count(*) FROM bookstore.likes WHERE user_id = ? AND book_id = books.id) AS liked
           FROM books 
           LEFT JOIN category ON category.category_id = books.category_id`;
  }

  if (categoryId) {
    sql += " WHERE books.category_id  = ?";
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
  const userId = req.body ? req.body.user_id : null; // 로그인된 경우 req.user.id 값을 사용

  let sql = `SELECT *,
    (SELECT count(*) FROM bookstore.likes WHERE book_id = ?) AS likes
    FROM books 
    LEFT JOIN category ON category.category_id = books.category_id 
    WHERE books.id = ?`;
  let values = [bookId, bookId];

  if (userId) {
    sql = `SELECT *,
           (SELECT count(*) FROM bookstore.likes WHERE book_id = ?) AS likes,
           (SELECT count(*) FROM bookstore.likes WHERE user_id = ? AND book_id = ?) AS liked
           FROM books 
           LEFT JOIN category ON category.category_id = books.category_id 
           WHERE books.id = ?`;
    values = [bookId, userId, bookId, bookId];
  }

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);
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
```

```js
// 유지 보수 위해 공통된 sql문 생성하는 함수 별도 생성
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
    sql += " WHERE category_id = ?";
    values.push(categoryId);
  }

  if (fetchNewBooks) {
    sql += categoryId ? " AND" : " WHERE";
    sql += " published_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()";
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
```
