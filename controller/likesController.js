const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');

const { handleError, throwError } = require('../utils/handleError');
const { checkLikeExistence, addLike, deleteLikeDB } = require('../model/likes');

/** 좋아요 추가 */
const postLike = async (req, res, next) => {
  try {
    const { bookId } = camelcaseKeys(req.params);
    const userId = req.user?.id;

    const isExist = await checkLikeExistence({ userId, bookId });
    if (isExist) {
      throwError('ER_ALREADY_EXISTS_LIKE');
    }
    const result = await addLike({ userId, bookId });
    if (!result) {
      throwError('좋아요 추가 실패');
    }
    res.status(StatusCodes.CREATED).send({ message: '좋아요 추가 성공' });
  } catch (err) {
    handleError(res, err);
  }
};

/** 좋아요 삭제 */
const deleteLike = async (req, res, next) => {
  try {
    const { bookId } = camelcaseKeys(req.params);
    const userId = req.user?.id;

    const isExist = await checkLikeExistence({ userId, bookId });
    if (isExist) {
      throwError('ER_NOT_FOUND');
    }

    const result = await deleteLikeDB({ userId, bookId });
    if (!result) {
      throwError('좋아요 삭제 실패');
    }

    res.status(StatusCodes.OK).send({ message: '좋아요 삭제 성공' });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { postLike, deleteLike };
