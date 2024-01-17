const { StatusCodes } = require('http-status-codes');
const pool = require('../mysql');

const { findAll } = require('../model/category');
const handleError = require('../utils/handleError');

const getCategory = async (req, res) => {
  try {
    const lists = await findAll();
    res.status(StatusCodes.OK).send({ lists });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { getCategory };
