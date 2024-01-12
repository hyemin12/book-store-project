const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateAndProceed = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(StatusCodes.BAD_REQUEST).send(errors.array());
};

module.exports = validateAndProceed;
