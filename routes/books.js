const express = require('express');
const router = express.Router();

const { getBooks, getSearchBooks, getIndividualBook, getBestSeller } = require('../controller/books.controller');
const { validatesGetBooks, validatesSearchBooks, validatesBook } = require('../validators/books');
const ensureAuthorization = require('../middleware/ensureAuthorization');

router.get('/', validatesGetBooks, ensureAuthorization(false), getBooks);
router.get('/best', ensureAuthorization(false), getBestSeller);
router.get('/search', validatesSearchBooks, ensureAuthorization(false), getSearchBooks);
router.get('/:book_id', validatesBook, ensureAuthorization(false), getIndividualBook);

module.exports = router;
