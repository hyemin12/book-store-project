const { body } = require('express-validator');
const validateAndProceed = require('../middleware/validateAndProceed');

const validatePostOrder = [
  body('books').isArray().withMessage('상품 리스트는 배열이어야 함'),
  body('delivery.recipient')
    .trim()
    .notEmpty()
    .withMessage('받는 사람은 필수 입력'),
  body('delivery.address').trim().notEmpty().withMessage('주소는 필수 입력'),
  body('delivery.contact')
    .trim()
    .notEmpty()
    .withMessage('전화번호는 필수 입력'),
  body('payment').trim().notEmpty().withMessage('지불 방법은 필수 입력'),
  body('total_price').isNumeric().withMessage('총 금액은 숫자이어야 함'),
  body('total_quantity').isNumeric().withMessage('총 수량은 숫자이어야 함'),
  body('first_book_title')
    .trim()
    .notEmpty()
    .withMessage('대표 도서는 필수 입력'),
  validateAndProceed
];

const validateGetOrderDetail = [
  body('order_id')
    .trim()
    .notEmpty()
    .withMessage('주문 번호는 필수 입력')
    .toInt()
    .withMessage('주문 번호는 숫자이어야 함')
];

module.exports = { validatePostOrder, validateGetOrderDetail };
