const { body, param } = require('express-validator');
const validateAndProceed = require('./validateAndProceed');

const validateUserId = body('user_id')
	.trim()
	.notEmpty()
	.isNumeric()
	.withMessage('user_id는 number 타입이어야 함');

const validateBookId = body('book_id')
	.trim()
	.notEmpty()
	.isNumeric()
	.withMessage('book_id는 number 타입이어야 함');

const validateQuantity = body('quantity')
	.trim()
	.notEmpty()
	.isNumeric()
	.withMessage('quantity는 number 타입이어야 함');

const validateId = param('id')
	.trim()
	.notEmpty()
	.isNumeric()
	.withMessage('id는 number 타입이어야 함');

const validateAddToCart = [
	validateUserId,
	validateBookId,
	validateQuantity,
	validateAndProceed
];
const validateGetCartsItems = [validateUserId.optional(), validateAndProceed];
const validateDeleteCartsItem = [validateId, validateAndProceed];
const validateUpdateCartItemCount = [
	validateId,
	validateQuantity,
	validateAndProceed
];

module.exports = {
	validateAddToCart,
	validateGetCartsItems,
	validateDeleteCartsItem,
	validateUpdateCartItemCount
};
