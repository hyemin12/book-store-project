const mysql = require('../mysql');

/** sql문을 실행하고, 결과값을 받는 함수
 * sql: 실행할 sql문
 * values: 바인딩할 파라미터
 * connection: 연결되어 있는 DB
 * keepConnection: 연결 종료 여부(여러 개의 sql문을 실행할 때는 true값을 전달해야 함)
 */
const getSqlQueryResult = async (
  sql,
  values,
  connection = undefined,
  keepConnection = false
) => {
  let conn = connection;

  try {
    if (!connection) {
      conn = await mysql.getConnection();
    }

    const [rows] = await conn.execute(sql, values);
    return { conn, rows };
  } catch (err) {
    throw err;
  } finally {
    if (!keepConnection && conn) {
      console.log('연결 해제!');
      conn.release();
    }
  }
};

module.exports = getSqlQueryResult;
