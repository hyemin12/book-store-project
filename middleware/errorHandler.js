const { StatusCodes } = require('http-status-codes');
const { mysqlErrorStatusCodes, CustomError } = require('../utils/errors');

const errorHandler = (error, req, res, next) => {
  // 커스텀 오류 클래스 확인
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send({
      error: {
        message: error.message,
        code: error.code,
        status: error.statusCode
      }
    });
  }

  console.error(error);

  // MySQL 오류 확인
  if (error.code && error.code.startsWith('ER_')) {
    const status = mysqlErrorStatusCodes[err.code] || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).send({
      error: {
        message: '데이터베이스 오류 발생',
        code: error.code,
        status: status
      }
    });
  }

  // 기타 오류
  res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
    error: {
      message: err.message || '서버 내부 오류가 발생했습니다.',
      code: 'ER_UNKNOWN',
      status: statusCodes.INTERNAL_SERVER_ERROR
    }
  });
};

module.exports = errorHandler;
