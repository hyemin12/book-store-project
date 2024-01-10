const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleError = require('../utils/handleError');
const throwError = require('../utils/throwError');
const checkExist = require('../utils/checkExist');

/** 좋아요 존재 여부 확인 */
const checkLikeExist = async (values) => {
  const sql = 'SELECT * FROM likes  WHERE user_id = ? AND book_id = ?';
  return checkExist(sql, values);
};

/** 좋아요 추가 */
const postLike = async (req, res, next) => {
  const { bookId } = req.params;
  const { user_id } = req.body;

  const insertLikeSql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
  const values = [user_id, bookId];

  try {
    // 좋아요 존재 여부 확인
    const { isExist, conn } = await checkLikeExist(values);

    if (isExist) {
      throwError('ER_ALREADY_EXISTS_LIKE');
    }

    const { rows } = await getSqlQueryResult(insertLikeSql, values, conn);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '좋아요 추가 성공' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

/** 좋아요 삭제 */
const deleteLike = async (req, res, next) => {
  const { bookId } = req.params;
  const { user_id } = req.body;

  const sql = `
    DELETE FROM likes
    WHERE user_id = ? AND book_id = ?
  `;
  const values = [user_id, bookId];

  try {
    const { isExist, conn } = await checkLikeExist(values);

    if (!isExist) {
      throwError('ER_NOT_FOUND');
    }

    const { rows } = await getSqlQueryResult(sql, values, conn);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '좋아요 삭제 성공' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { postLike, deleteLike };
