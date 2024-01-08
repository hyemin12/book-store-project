const express = require('express');
const { getCategory } = require('../controller/categoryController');

const router = express.Router();
router.use(express.json());

router.get('/', getCategory);

module.exports = router;
