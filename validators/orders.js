const { body } = require('express-validator');
const validateAndProceed = require('./validateAndProceed');

const validateDelivery = [
  body('delivery.recipient')
    .trim()
    .notEmpty()
    .withMessage('받는 사람은 필수 입력')
    .toString()
    .withMessage('문자열이어야 함'),
  body('delivery.address')
    .trim()
    .notEmpty()
    .withMessage('주소는 필수 입력')
    .toString()
    .withMessage('문자열이어야 함'),
  body('delivery.contact')
    .trim()
    .notEmpty()
    .withMessage('전화번호는 필수 입력')
    .toString()
    .withMessage('문자열이어야 함')
];
const validatePostOrder = [
  body('lists').isArray().withMessage('상품 리스트는 배열이어야 함'),
  validateDelivery,
  body('payment').trim().notEmpty().withMessage('지불 방법은 필수 입력'),
  body('totalPrice').isNumeric().withMessage('총 금액은 숫자이어야 함'),
  body('totalQuantity').isNumeric().withMessage('총 수량은 숫자이어야 함'),
  body('user_id').isNumeric().withMessage('유저 아이디는 숫자이어야 함'),
  body('FirstBookTitle').trim().notEmpty().withMessage('대표 도서는 필수 입력'),
  validateAndProceed
];

module.exports = { validatePostOrder };
