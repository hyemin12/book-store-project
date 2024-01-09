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

const router = express.Router();
router.use(express.json());

router.get('/', validatesGetBooks, getBooks);
router.get('/search', validatesSearchBooks, getSearchBooks);
router.get('/:bookId', validatesBook, getIndividualBook);

module.exports = router;
