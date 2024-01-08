const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

const addToCart = async (req, res) => {
	const { user_id, book_id, quantity } = req.body;
	const sql = 'INSERT INTO cartItems (book_id,quantity,user_id) VALUES (?,?,?)';
	const values = [book_id, quantity, user_id];
	try {
		const { rows, conn } = await getSqlQueryResult(sql, values);

		if (rows.affectedRows > 0) {
			res.status(StatusCodes.CREATED).send({ message: '장바구니 추가 성공' });
		} else {
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({ message: '장바구니 추가 실패' });
		}
		conn.release();
	} catch (err) {
		handleServerError(res, err);
	}
};

const getCartsItems = async (req, res) => {
	const { user_id } = req.body;
	const sql = `SELECT cartItems.id, book_id, title, summary, price, quantity FROM cartItems 
        LEFT JOIN books ON cartItems.book_id = books.id
        WHERE user_id = ? `;
	try {
		const { rows, conn } = await getSqlQueryResult(sql, [user_id]);
		res.status(StatusCodes.OK).send({ lists: rows });

		conn.release();
	} catch (err) {
		handleServerError(res, err);
	}
};

const deleteCartsItem = async (req, res) => {
	const { id } = req.params;
	const sql = `DELETE FROM cartItems
        WHERE id = ? `;
	try {
		const { rows, conn } = await getSqlQueryResult(sql, [id]);

		if (rows.affectedRows > 0) {
			res.status(StatusCodes.OK).send({ message: '아이템 삭제 성공' });
		} else {
			res.status(StatusCodes.BAD_REQUEST).send({ message: '아이템 삭제 실패' });
		}
		conn.release();
	} catch (err) {
		handleServerError(res, err);
	}
};

const updateCartItemCount = async (req, res) => {
	const { id } = req.params;
	const { quantity } = req.body;

	const sql = `UPDATE cartItems SET quantity = ? 
		WHERE id = ?`;
	const values = [quantity, id];

	try {
		const { rows, conn } = await getSqlQueryResult(sql, values);

		if (rows.affectedRows > 0) {
			res.status(StatusCodes.OK).send({ message: '수량 변경 성공' });
		} else {
			res.status(StatusCodes.BAD_REQUEST).send({ message: '수량 변경 실패' });
		}
		conn.release();
	} catch (err) {
		handleServerError(res, err);
	}
};

module.exports = {
	addToCart,
	deleteCartsItem,
	getCartsItems,
	updateCartItemCount
};
