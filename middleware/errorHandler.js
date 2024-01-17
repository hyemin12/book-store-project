const { StatusCodes } = require('http-status-codes');

const errorHandler = (error, req, res, next) => {
  const name = error.code ?? error.name ?? error;

  if (!name) {
    console.error(error);
  }

  const message = errors[name]?.message || '내부 서버 오류';
  const statusCode = errors[name]?.code || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).send({
    error: {
      message,
      status: statusCode
    }
  });
};

module.exports = errorHandler;
