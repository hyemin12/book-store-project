const express = require('express');
const router = express.Router();

const { postLike, deleteLike } = require('../controller/likes.controller');
const { validateLikes } = require('../validators/likes');
const ensureAuthorization = require('../middleware/ensureAuthorization');

router
  .route('/:book_id')
  .post(validateLikes, ensureAuthorization(), postLike)
  .delete(validateLikes, ensureAuthorization(), deleteLike);

module.exports = router;
