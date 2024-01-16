const express = require('express');
const router = express.Router();
const { createRandomIsbn, createRandomUser } = require('../controller/fakerController');

router.get('/isbn', createRandomIsbn);
router.get('/user', createRandomUser);

module.exports = router;
