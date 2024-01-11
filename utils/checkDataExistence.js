const getSqlQueryResult = require('./getSqlQueryResult');
const { throwError } = require('./handleError');

/** 데이터베이스에 존재하는 데이터인지 확인하는 sql문 */
const checkExistSqls = {
  itemToCart: 'SELECT * FROM cartItems WHERE user_id = ? AND book_id = ?',
  like: 'SELECT * FROM likes WHERE user_id = ? AND book_id = ?',
  delivery:
    'SELECT * from delivery WHERE recipient= ? AND address = ? AND contact = ?',
  email: 'SELECT * FROM users WHERE email = ?',
  user: 'SELECT * FROM users WHERE id = ?',
  book: 'SELECT * FROM books WHERE id = ?'
};

/** 존재 여부 확인
 * @param entityType 필수
 * @param values sql 바인딩 파라미터
 * @return 이미 존재하는 경우에는 isExist는 true가 반환됨
 */
const checkDataExistence = async (
  entityType,
  values = [],
  connection = undefined
) => {
  const sql = checkExistSqls[entityType];

  try {
    const { rows, conn } = await getSqlQueryResult(
      sql,
      values,
      connection,
      true
    );

    return { isExist: !!rows.length, conn, rows };
  } catch (err) {
    throwError('ER_UNPROCESSABLE_ENTITY');
  }
};

module.exports = checkDataExistence;
