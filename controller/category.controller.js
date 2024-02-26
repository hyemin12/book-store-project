const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');

const { findAll } = require('../model/category.model');

const getCategory = asyncHandler(async (req, res) => {
  const lists = await findAll();
  res.status(StatusCodes.OK).send({ lists });
});

module.exports = { getCategory };
