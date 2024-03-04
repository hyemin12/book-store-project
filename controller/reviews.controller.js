const camelcaseKeys = require('camelcase-keys');
const { StatusCodes } = require('http-status-codes');
const expressAsyncHandler = require('express-async-handler');
const { findReviews, createReview } = require('../model/reviews.model');

const getReviews = expressAsyncHandler(async (req, res) => {
  const { bookId } = camelcaseKeys(req.params);
  const result = await findReviews({ bookId });

  res.status(StatusCodes.OK).send(result);
});

const postReview = expressAsyncHandler(async (req, res) => {
  const { bookId } = camelcaseKeys(req.params);
  const { content, createdAt, score } = camelcaseKeys(req.body);
  const userId = req.user?.id;

  const result = await createReview({ bookId, content, createdAt, score, userId });
  return res.status(StatusCodes.CREATE).send(result);
});

module.exports = { getReviews, postReview };
