const express = require('express');
const router = express.Router();

const {
	postOrder,
	getOrders,
	getOrderDetail
} = require('../controller/ordersController');

router.use(express.json());

router.route('/').post(postOrder).get(getOrders);

router.get('/:orderId', getOrderDetail);

module.exports = router;
