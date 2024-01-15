const express = require('express');
const router = express.Router();

const { getCategory } = require('../controller/categoryController');
const ensureAuthorization = require('../middleware/ensureAuthorization');

router.get('/', ensureAuthorization(false), getCategory);

module.exports = router;
