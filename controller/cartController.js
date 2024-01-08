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
	const sql = `SELECT * from cartItems 
        WHERE user_id = ? `;
	try {
		const { rows, conn } = await getSqlQueryResult(sql);
		res.status(StatusCodes.OK).send({ lists: rows });

		conn.release();
	} catch (err) {
		handleServerError(res, err);
	}
};

const deleteCartsItem = async (req, res) => {
	const { id } = req.params;
	// const {user_id} = req.body
	const sql = `DELETE FROM cartItems
    WHERE id = ? `;
	const values = [id];
	try {
		const { rows, conn } = await getSqlQueryResult(sql, values);

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

module.exports = { addToCart, deleteCartsItem, getCartsItems };
