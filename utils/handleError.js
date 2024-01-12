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
  ValidationError: {
    code: StatusCodes.BAD_REQUEST,
    message: '잘못된 요청'
  },
  ER_NO_TOKEN: {
    code: StatusCodes.UNAUTHORIZED,
    message: '토큰 없음'
  },
  ER_SESSION_EXPIRED: {
    code: StatusCodes.UNAUTHORIZED,
    message: '로그인(인증) 세션이 만료되었습니다.'
  },
  ER_INVALID_TOKEN: {
    code: StatusCodes.UNAUTHORIZED,
    message: '토큰이 유효하지 않습니다.'
  },
  ER_INVALID_ISSUER: {
    code: StatusCodes.UNPROCESSABLE_ENTITY,
    message: '잘못된 토큰 발급자입니다.'
  },
  ER_NOT_MATCHED_PASSWORD: {
    code: StatusCodes.UNAUTHORIZED,
    message: '비밀번호 불일치'
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
  ER_UNPROCESSABLE_ENTITY: {
    code: StatusCodes.UNPROCESSABLE_ENTITY,
    message: '처리할 수 없는 요청'
  },
  ER_UNKNOWN: {
    code: StatusCodes.UNPROCESSABLE_ENTITY,
    message: '알 수 없는 에러가 발생했습니다.'
  },
  ER_DATABASE: {
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: '데이터베이스 조회 중 오류가 발생했습니다.'
  }
};

const handleError = (res, error) => {
  const name = error.name ?? error;

  if (!name) {
    console.error(error);
  }

  const message = errors[name]?.message || '내부 서버 오류';
  const statusCode = errors[name]?.code || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).send({ message });
};

/**
 * 주어진 메시지를 사용하여 오류를 생성하고 던짐
 * 던져진 오류는 handleError()를 통해 클라이언트에게 전달됨
 */
const throwError = (message) => {
  const error = new Error(message);
  error.name = message;
  throw error;
};

module.exports = { throwError, handleError };
