const { getConnection, releaseConnection } = require('./connectionUtil');
const { throwError } = require('./handleError');

/** 존재 여부 확인
 * @param sql 필수
 * @param values sql 바인딩 파라미터
 * @param conn 데이터베이스 연결상태
 * @return 이미 존재하는 경우에는 isExist는 true가 반환됨
 */
const checkDataExistence = async (sql, values = [], conn) => {
  try {
    const connection = await getConnection(conn);
    const [rows] = await connection.execute(sql, values);
    releaseConnection(connection, conn);
    return { isExist: !!rows.length, rows };
  } catch (err) {
    throwError('ER_DATABASE');
  }
};

module.exports = checkDataExistence;
