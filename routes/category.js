const express = require('express');
const { getCategory } = require('../controller/categoryController');
const ensureAuthorization = require('../middleware/decodedJWT');

const router = express.Router();
router.use(express.json());

router.get('/', ensureAuthorization(false), getCategory);

module.exports = router;
