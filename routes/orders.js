const express = require('express');
const router = express.Router();

const { validatePostOrder, validateGetOrderDetail } = require('../validators/orders');

const { postOrder, getOrders, getOrderDetail } = require('../controller/ordersController');
const ensureAuthorization = require('../middleware/decodedJWT');

router.use(express.json());

router.route('/').post(validatePostOrder, ensureAuthorization(), postOrder).get(ensureAuthorization(), getOrders);

router.get('/:order_id', validateGetOrderDetail, ensureAuthorization(), getOrderDetail);

module.exports = router;
