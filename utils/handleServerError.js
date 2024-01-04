const { StatusCodes } = require("http-status-codes");

const handleServerError = (res, error) => {
  console.error(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
};

module.exports = handleServerError;
