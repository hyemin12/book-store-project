const pool = require('../mysql');
const { throwError } = require('./handleError');

/** 존재 여부 확인
 * @param sql 필수
 * @param values sql 바인딩 파라미터
 * @return 이미 존재하는 경우에는 isExist는 true가 반환됨
 */
const checkDataExistence = async (sql, values = []) => {
  try {
    const [rows] = await pool.execute(sql, values);
    return { isExist: !!rows.length, rows };
  } catch (err) {
    throwError('ER_DATABASE');
  }
};

module.exports = checkDataExistence;
