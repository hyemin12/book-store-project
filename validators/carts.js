const { param, query } = require('express-validator');
const validateAndProceed = require('./validateAndProceed');

const validateBookId = query('categoryId')
	.trim()
	.notEmpty()
	.isNumeric()
	.withMessage('categoryId는 number 타입이어야 함');
