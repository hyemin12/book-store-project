const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

const getCategory = async (req, res) => {
  const sql = 'SELECT * FROM category';
  try {
    const { rows } = await getSqlQueryResult(sql);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleServerError(res, err);
  }
};

module.exports = { getCategory };
