const { StatusCodes } = require('http-status-codes');

class CustomError extends Error {
  constructor(message, errorCode, statusCode) {
    super(message);
    this.code = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'SQL 구문 오류', errorCode = 'ER_PARSE_ERROR') {
    super(message, errorCode, StatusCodes.BAD_REQUEST);
    this.name = this.constructor.name;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = '토큰이 유효하지 않습니다.', errorCode = 'ER_INVALID_TOKEN') {
    super(message, errorCode, StatusCodes.UNAUTHORIZED);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends CustomError {
  constructor(message = '존재하지 않는 데이터', errorCode = 'ER_NOT_FOUND') {
    super(message, errorCode, StatusCodes.NOT_FOUND);
    this.name = this.constructor.name;
  }
}

class NotFoundEmailError extends CustomError {
  constructor(message = '존재하지 않는 이메일', errorCode = 'ER_NOT_FOUND_EMAIL') {
    super(message, errorCode, StatusCodes.NOT_FOUND);
    this.name = this.constructor.name;
  }
}

class ConflictError extends CustomError {
  constructor(message = '이미 존재하는 데이터', errorCode = 'ER_ALREADY_EXISTS') {
    super(message, errorCode, StatusCodes.CONFLICT);
    this.name = this.constructor.name;
  }
}

class UnProcessableError extends CustomError {
  constructor(message = '요청을 확인했으나, 알 수 없는 에러가 발생', errorCode = 'ER_UNKNOWN') {
    super(message, errorCode, StatusCodes.UNPROCESSABLE_ENTITY);
    this.name = this.constructor.name;
  }
}

class DatabaseError extends CustomError {
  constructor(message = '데이터 처리 중 오류 발생', errorCode = 'ER_DATABASE') {
    super(message, errorCode, StatusCodes.INTERNAL_SERVER_ERROR);
    this.name = this.constructor.name;
  }
}

class ServerError extends CustomError {
  constructor(message = '서버 내부 오류가 발생', errorCode = 'ER_SERVER_ERROR') {
    super(message, errorCode, StatusCodes.INTERNAL_SERVER_ERROR);
    this.name = this.constructor.name;
  }
}

// https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html
const mysqlErrorStatusCodes = {
  ER_DATA_TOO_LONG: StatusCodes.BAD_REQUEST,
  ER_NO_SUCH_TABLE: StatusCodes.BAD_REQUEST,
  ER_BAD_FIELD_ERROR: StatusCodes.BAD_REQUEST,
  ER_PARSE_ERROR: StatusCodes.BAD_REQUEST
};

module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  NotFoundEmailError,
  ConflictError,
  UnProcessableError,
  DatabaseError,
  ServerError,
  mysqlErrorStatusCodes
};
