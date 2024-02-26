const express = require('express');
const router = express.Router();
const { createRandomIsbn, createRandomUser } = require('../controller/faker.controller');

router.get('/isbn', createRandomIsbn);
router.get('/user', createRandomUser);

module.exports = router;
