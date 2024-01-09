const { StatusCodes } = require('http-status-codes');
const mysql = require('../mysql');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

const postOrder = async (req, res, next) => {
	const {
		lists,
		delivery,
		payment,
		totalPrice,
		user_id,
		totalQuantity,
		FirstBookTitle
	} = req.body;

	const sqlDelivery = `
    INSERT INTO delivery 
    (recipient,address,contact) 
    VALUES (?,?,?)
  `;
	const valuesDelivery = [
		delivery.recipient,
		delivery.address,
		delivery.contact
	];

	let conn = await mysql.getConnection();
	try {
		// Delivery 데이터 삽입
		const { rows: rowsDelivery } = await getSqlQueryResult(
			sqlDelivery,
			valuesDelivery
		);
		const delivery_id = rowsDelivery.insertId;

		const sqlOrders = `
      INSERT INTO orders 
      (book_title,total_quantity,total_price,payment,delivery_id,user_id) 
      VALUES(?,?,?,?,?,?)
    `;
		const valuesOrders = [
			FirstBookTitle,
			totalQuantity,
			totalPrice,
			payment,
			delivery_id,
			user_id
		];

		// Orders 데이터 삽입
		const { rows: rowsOrders } = await getSqlQueryResult(
			sqlOrders,
			valuesOrders
		);
		const order_id = rowsOrders.insertId;

		const sqlOrderedBook = `
      INSERT INTO orderedbook 
      (order_id,book_id,quantity) 
      VALUES (?,?,?)${', (?,?,?)'.repeat(lists.length - 1)}
    `;
		let valuesOrderedBook = [];
		let valuesDeleteCart = [];
		lists.forEach((item) => {
			valuesOrderedBook.push(order_id, item.id, item.quantity);
			valuesDeleteCart.push(item.cartItem_id);
		});

		// Orderedbook 데이터 삽입
		const { rows: rowsOrderedBook } = await getSqlQueryResult(
			sqlOrderedBook,
			valuesOrderedBook
		);

		const sqlDeleteCart = `
      DELETE FROM cartItems
      WHERE id IN (?${',?'.repeat(lists.length - 1)})
    `;
		// CartItems 정보 삭제
		const { rows: rowsDeleteCart } = await getSqlQueryResult(
			sqlDeleteCart,
			valuesDeleteCart
		);

		// Commit the transaction
		await conn.commit();

		res
			.status(StatusCodes.OK)
			.send({ message: '결제 성공 및 장바구니 아이템 삭제', rowsDeleteCart });
	} catch (err) {
		await conn.rollback();
		handleServerError(res, err);
	} finally {
		conn.release();
	}
};

const getOrders = async (req, res, next) => {
	res.status(StatusCodes.OK).send({ message: '주문 내역 조회' });
};

const getOrderDetail = async (req, res, next) => {
	const { orderId } = req.params;
	res.status(StatusCodes.OK).send({ message: '상세 내역 조회' });
};

module.exports = { postOrder, getOrders, getOrderDetail };
