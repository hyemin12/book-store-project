const express = require('express');
const router = express.Router();

const {
	addToCart,
	deleteCartsItem,
	getCartsItems
} = require('../controller/cartController');

router.use(express.json());

router.route('/').post(addToCart).get(getCartsItems);

router.delete('/:id', deleteCartsItem);

router.route('/order').get(async (req, res, next) => {
	res.status(200).send({ message: '장바구니에서 선택한 상품 목록 조회' });
});

module.exports = router;
