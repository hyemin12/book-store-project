const express = require('express');
const router = express.Router();

const { getBooks, getSearchBooks, getIndividualBook } = require('../controller/booksController');
const { validatesGetBooks, validatesSearchBooks, validatesBook } = require('../validators/books');
const ensureAuthorization = require('../middleware/decodedJWT');

router.get('/', validatesGetBooks, ensureAuthorization(false), getBooks);
router.get('/search', validatesSearchBooks, ensureAuthorization(false), getSearchBooks);
router.get('/:book_id', validatesBook, ensureAuthorization(false), getIndividualBook);

module.exports = router;
