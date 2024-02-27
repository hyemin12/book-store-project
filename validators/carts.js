const { body, param } = require('express-validator');

const validateAndProceed = require('../middleware/validateAndProceed');

const validateBookId = body('book_id').trim().notEmpty().withMessage('book_id는 필수');
const validateQuantity = body('quantity').trim().notEmpty().withMessage('quantity는 필수');

const validateId = param('id').trim().notEmpty().isInt().withMessage('id는 number 타입이어야 함');

const validateAddToCart = [validateBookId, validateQuantity, validateAndProceed];
const validateGetCartsItems = [validateAndProceed];
const validateDeleteCartsItem = [validateId, validateAndProceed];
const validateUpdateCartItemCount = [validateId, validateAndProceed];

module.exports = {
  validateAddToCart,
  validateGetCartsItems,
  validateDeleteCartsItem,
  validateUpdateCartItemCount
};
