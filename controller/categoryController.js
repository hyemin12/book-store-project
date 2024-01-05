const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

const getCategory = async (req, res) => {
	const sql = 'SELECT * FROM category';
	try {
		const { rows, conn } = await getSqlQueryResult(sql);
		res.status(StatusCodes.OK).send({ lists: rows });
		conn.release();
	} catch (err) {
		handleServerError(res, err);
	}
};

module.exports = { getCategory };
