const express = require('express');
const router = express.Router();

const {
  addToCart,
  deleteCartsItem,
  getCartsItems,
  updateCartItemCount
} = require('../controller/cartController');

const {
  validateAddToCart,
  validateGetCartsItems,
  validateDeleteCartsItem,
  validateUpdateCartItemCount
} = require('../validators/carts');

router.use(express.json());

router
  .route('/')
  .post(validateAddToCart, addToCart)
  .get(validateGetCartsItems, getCartsItems);

router
  .route('/:id')
  .delete(validateDeleteCartsItem, deleteCartsItem)
  .put(validateUpdateCartItemCount, updateCartItemCount);

router.route('/order').get(async (req, res, next) => {
  res.status(200).send({ message: '장바구니에서 선택한 상품 목록 조회' });
});

module.exports = router;
