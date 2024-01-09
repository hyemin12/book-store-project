const { body, param } = require('express-validator');
const validateAndProceed = require('./validateAndProceed');
const getSqlQueryResult = require('../utils/getSqlQueryResult');

const validateUserId = body('user_id')
  .trim()
  .notEmpty()
  .isNumeric()
  .withMessage('user_id는 number 타입이어야 함')
  .custom(async (user_id) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const { conn, rows } = await getSqlQueryResult(sql, [user_id]);

    if (!rows.length) {
      throw new Error('일치하는 회원이 없음');
    }

    conn.release();

    return true;
  });

const validateBookId = body('book_id')
  .trim()
  .notEmpty()
  .isNumeric()
  .withMessage('book_id는 number 타입이어야 함')
  .custom(async (book_id) => {
    const sql = 'SELECT * FROM books WHERE id = ?';
    const { conn, rows } = await getSqlQueryResult(sql, [book_id]);

    if (!rows.length) {
      throw new Error('일치하는 book_id가 없음');
    }

    conn.release();

    return true;
  });

const validateQuantity = body('quantity')
  .trim()
  .notEmpty()
  .isNumeric()
  .withMessage('quantity는 number 타입이어야 함');

const validateId = param('id')
  .trim()
  .notEmpty()
  .isNumeric()
  .withMessage('id는 number 타입이어야 함')
  .custom(async (id) => {
    const sql = 'SELECT * FROM cartItems WHERE id = ?';
    const { conn, rows } = await getSqlQueryResult(sql, [id]);

    if (!rows.length) {
      throw new Error('일치하는 상품이 없음');
    }

    conn.release();

    return true;
  });

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
