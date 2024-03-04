const express = require('express');
const { getReviews, postReview } = require('../controller/reviews.controller');
const ensureAuthorization = require('../middleware/ensureAuthorization');

const router = express.Router();

router.route('/:book_id').get(ensureAuthorization(false), getReviews).post(ensureAuthorization(), postReview);

module.exports = router;
