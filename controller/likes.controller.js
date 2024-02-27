const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const asyncHandler = require('express-async-handler');

const { ConflictError, DatabaseError, NotFoundError } = require('../utils/errors');
const { checkLikeExistence, addLike, deleteLikeDB } = require('../model/likes.model');

/** 좋아요 추가 */
const postLike = asyncHandler(async (req, res) => {
  const { bookId } = camelcaseKeys(req.params);
  const userId = req.user?.id;

  const isExist = await checkLikeExistence({ userId, bookId });
  if (isExist) {
    throw new ConflictError();
  }

  const result = await addLike({ userId, bookId });
  if (!result) {
    throw new DatabaseError();
  }

  res.status(StatusCodes.CREATED).send({ message: '좋아요 추가 성공' });
});

/** 좋아요 삭제 */
const deleteLike = asyncHandler(async (req, res) => {
  const { bookId } = camelcaseKeys(req.params);
  const userId = req.user?.id;

  const isExist = await checkLikeExistence({ userId, bookId });
  if (!isExist) {
    throw new NotFoundError();
  }

  const result = await deleteLikeDB({ userId, bookId });
  if (!result) {
    throw new DatabaseError();
  }

  res.status(StatusCodes.OK).send({ message: '좋아요 삭제 성공' });
});

module.exports = { postLike, deleteLike };
