const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const { handleError, throwError } = require('../utils/handleError');
const checkDataExistence = require('../utils/checkDataExistence');

/** 좋아요 추가 */
const postLike = async (req, res, next) => {
  const { bookId } = camelcaseKeys(req.params);
  const { user_id } = req.body;

  const sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
  const values = [user_id, bookId];

  try {
    const { isExist, conn } = await checkDataExistence('like', values);

    if (isExist) {
      throwError('ER_ALREADY_EXISTS_LIKE');
    }

    const { rows } = await getSqlQueryResult(sql, values, conn);

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
  const { bookId } = camelcaseKeys(req.params);
  const { user_id } = req.body;

  const sql = `
    DELETE FROM likes
    WHERE user_id = ? AND book_id = ?
  `;
  const values = [user_id, bookId];

  try {
    const { isExist, conn } = await checkDataExistence('like', values);

    if (!isExist) {
      throwError('ER_NOT_FOUND');
    }

    const { rows } = await getSqlQueryResult(sql, values, conn);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '좋아요 삭제 성공' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { postLike, deleteLike };
