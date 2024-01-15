const express = require('express');
const router = express.Router();

const { addToCart, deleteCartsItem, getCartsItems, updateCartItemCount } = require('../controller/cartController');
const {
  validateAddToCart,
  validateGetCartsItems,
  validateDeleteCartsItem,
  validateUpdateCartItemCount
} = require('../validators/carts');
const ensureAuthorization = require('../middleware/decodedJWT');

router
  .route('/')
  .post(validateAddToCart, ensureAuthorization(), addToCart)
  .get(validateGetCartsItems, ensureAuthorization(), getCartsItems);

router
  .route('/:id')
  .delete(validateDeleteCartsItem, ensureAuthorization(), deleteCartsItem)
  .put(validateUpdateCartItemCount, ensureAuthorization(), updateCartItemCount);

module.exports = router;
