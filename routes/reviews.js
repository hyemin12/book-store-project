const express = require('express');
const { getReviews, postReview } = require('../controller/reviews.controller');

const router = express.Router();

router.route('/:book_id').get(getReviews).post(postReview);

module.exports = router;
