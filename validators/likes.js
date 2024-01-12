const { param } = require('express-validator');
const validateAndProceed = require('../middleware/validateAndProceed');

const validateBookId = param('book_id')
  .trim()
  .notEmpty()
  .withMessage('도서 아이디는 필수');

const validateLikes = [validateBookId, validateAndProceed];

module.exports = { validateLikes };
