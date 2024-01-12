const express = require('express');
const {
  getBooks,
  getSearchBooks,
  getIndividualBook
} = require('../controller/booksController');
const {
  validatesGetBooks,
  validatesSearchBooks,
  validatesBook
} = require('../validators/books');
const ensureAuthorization = require('../middleware/decodedJWT');

const router = express.Router();
router.use(express.json());

router.get('/', validatesGetBooks, ensureAuthorization(false), getBooks);
router.get('/search', validatesSearchBooks, getSearchBooks);
router.get(
  '/:book_id',
  validatesBook,
  ensureAuthorization(false),
  getIndividualBook
);

module.exports = router;
