const { StatusCodes } = require('http-status-codes');
const pool = require('../mysql');

const handleError = require('../utils/handleError');

const getCategory = async (req, res) => {
  const sql = 'SELECT * FROM category';
  try {
    const [rows] = await pool.execute(sql);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { getCategory };
