const { param, query } = require('express-validator');
const validateAndProceed = require('./validateAndProceed');

const validateCategoryId = query('categoryId')
	.trim()
	.notEmpty()
	.isNumeric()
	.withMessage('categoryId는 number 타입이어야 함');

const validateNew = query('new')
	.optional()
	.trim()
	.notEmpty()
	.isBoolean()
	.withMessage('new는 boolean 타입이어야 함')
	.default(false);

const validatePage = query('page')
	.optional()
	.trim()
	.notEmpty()
	.isNumeric()
	.isInt({ min: 1 })
	.withMessage('페이지는 1 이상의 숫자여야 합니다.')
	.default(1);

const validateQuery = query('query')
	.trim()
	.notEmpty()
	.isString()
	.withMessage('검색어는 문자열이어야 함');

const validateBookId = param('bookId').trim().notEmpty();

const validatesGetBooks = [
	validateCategoryId.optional(),
	validateNew.optional(),
	validatePage.optional(),
	validateAndProceed
];
const validatesSearchBooks = [validateQuery, validatePage, validateAndProceed];
const validatesBook = [validateBookId, validateAndProceed];

module.exports = { validatesGetBooks, validatesSearchBooks, validatesBook };
