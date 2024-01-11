const express = require('express');
const router = express.Router();
const { postLike, deleteLike } = require('../controller/likesController');
const { validateLikes } = require('../validators/likes');

router.use(express.json());

router
  .route('/:book_id')
  .post(validateLikes, postLike)
  .delete(validateLikes, deleteLike);

module.exports = router;
