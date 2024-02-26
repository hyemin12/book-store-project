const express = require('express');
const router = express.Router();

const { validatePostOrder, validateGetOrderDetail } = require('../validators/orders');

const { postOrder, getOrders, getOrderDetail } = require('../controller/orders.controller');
const ensureAuthorization = require('../middleware/ensureAuthorization');

router.route('/').post(validatePostOrder, ensureAuthorization(), postOrder).get(ensureAuthorization(), getOrders);

router.get('/:order_id', validateGetOrderDetail, ensureAuthorization(), getOrderDetail);

module.exports = router;
