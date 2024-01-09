const express = require('express');
const router = express.Router();

const { validatePostOrder } = require('../validators/orders');

const {
  postOrder,
  getOrders,
  getOrderDetail
} = require('../controller/ordersController');

router.use(express.json());

router.route('/').post(validatePostOrder, postOrder).get(getOrders);

router.get('/:orderId', getOrderDetail);

module.exports = router;
