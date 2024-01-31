const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  ConflictError,
  DatabaseError,
  NotFoundError,
  NotFoundEmailError,
  UnauthorizedError,
  ServerError
} = require('../utils/errors');
const { checkEmailExistence, createUser, findUser, updateUserPassword } = require('../model/users');

// ENV KEY
const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;
const TOKEN_ISSUER = process.env.TOKEN_ISSUER;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

if (!TOKEN_PRIVATE_KEY || !TOKEN_ISSUER) {
  throw new Error('환경변수가 제대로 설정되지 않았습니다.');
}

/** 비밀번호 해싱 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new ServerError('비밀번호 해싱 중 에러 발생');
  }
};

/** 회원가입 */
const joinUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const isExist = await checkEmailExistence({ email });
  if (isExist) {
    throw new ConflictError('이미 존재하는 이메일');
  }

  const result = await createUser({ email, password: hashedPassword });
  if (!result) {
    throw new DatabaseError();
  }

  res.status(StatusCodes.CREATED).send({ message: '회원가입 완료' });
});

/** 로그인 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const isExist = await checkEmailExistence({ email });
  if (!isExist) {
    throw new NotFoundEmailError();
  }

  const loginUser = await findUser({ email });
  if (!loginUser) {
    throw new NotFoundError('일치하는 회원 없음');
  }

  // 비밀번호 검증
  const matchPassword = await bcrypt.compare(password, loginUser.password);
  if (!matchPassword) {
    throw new UnauthorizedError('비밀번호 불일치', 'ER_NOT_MATCHED_PASSWORD');
  }

  // 토큰 생성
  const token = jwt.sign({ email: loginUser.email, id: loginUser.id }, TOKEN_PRIVATE_KEY, {
    expiresIn: '30m',
    issuer: TOKEN_ISSUER
  });

  res
    .status(StatusCodes.OK)
    .cookie('access_token', token, {
      httpOnly: true,
      // https 연결에서만 쿠키 발급되도록 설정
      secure: process.env.NODE_ENV === 'production'
    })
    .send({ message: '로그인 성공' });
  console.log(token);
});

/** 비밀번호 초기화 요청 */
const requestResetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const isExist = await checkEmailExistence({ email });
  if (!isExist) {
    throw new NotFoundEmailError();
  }

  res.status(StatusCodes.OK).send({ email });
});

/** 비밀번호 초기화 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const isExist = await checkEmailExistence({ email });
  if (!isExist) {
    throw new NotFoundEmailError();
  }

  const result = await updateUserPassword({ email, password: hashedPassword });
  if (!result) {
    throw new DatabaseError();
  }

  res.status(StatusCodes.OK).send({ message: '비밀번호 초기화 성공' });
});

module.exports = { joinUser, loginUser, requestResetPassword, resetPassword };
