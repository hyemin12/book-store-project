const getSqlQueryResult = require('./getSqlQueryResult');

/** 존재 여부 확인
 * 이미 존재하는 경우에는 isExist는 true가 반환됨
 */
const checkExist = async (sql, values, connection = undefined) => {
  const { rows, conn } = await getSqlQueryResult(sql, values, undefined, true);

  return { isExist: !!rows.length, conn, rows };
};

module.exports = checkExist;
