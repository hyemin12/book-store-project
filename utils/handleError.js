const { StatusCodes } = require('http-status-codes');

const errors = {
  ER_BAD_FIELD_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message: '잘못된 필드를 참조'
  },
  ER_NO_SUCH_TABLE: {
    code: StatusCodes.BAD_REQUEST,
    message: '존재하지 않는 테이블을 참조'
  },
  ER_DATA_TOO_LONG: {
    code: StatusCodes.BAD_REQUEST,
    message: '허용된 데이터 길이 초과'
  },
  ER_PARSE_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message: 'SQL 구문 오류'
  },
  AuthenticationError: {
    code: StatusCodes.UNAUTHORIZED,
    message: '인증에 실패'
  },
  ER_NOT_FOUND_EMAIL: {
    code: StatusCodes.NOT_FOUND,
    message: '일치하는 이메일이 없음'
  },
  ER_NOT_FOUND: {
    code: StatusCodes.NOT_FOUND,
    message: '존재하지 않는 데이터'
  },
  ER_ALREADY_EXISTS_EMAIL: {
    code: StatusCodes.CONFLICT,
    message: '이미 존재하는 이메일'
  },
  ER_ALREADY_EXISTS_LIKE: {
    code: StatusCodes.CONFLICT,
    message: '이미 좋아요를 추가한 책'
  },
  ER_ALREADY_EXISTS: {
    code: StatusCodes.CONFLICT,
    message: '이미 존재하는 데이터'
  },
  ER_NOT_MATCHED_PASSWORD: {
    code: StatusCodes.UNAUTHORIZED,
    message: '비밀번호 불일치'
  },
  ValidationError: {
    code: StatusCodes.BAD_REQUEST,
    message: '잘못된 요청'
  },
  ER_UNPROCESSABLE_ENTITY: {
    code: StatusCodes.UNPROCESSABLE_ENTITY,
    message: '처리할 수 없는 요청'
  }
};

const handleError = (res, error) => {
  console.error(error);

  const message = errors[error.name]?.message || '내부 서버 오류';
  const statusCode =
    errors[error.name]?.code || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).send({ message });
};

module.exports = handleError;
