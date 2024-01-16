const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { handleError, throwError } = require('../utils/handleError');
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
    throwError('비밀번호 해싱 중 에러 발생');
  }
};

/** 회원가입 */
const joinUser = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const isExist = await checkEmailExistence({ email });
    if (isExist) {
      throwError('ER_ALREADY_EXISTS_EMAIL');
    }

    const result = await createUser({ email, password: hashedPassword });

    if (!result) {
      throwError('회원가입 실패');
    }

    res.status(StatusCodes.CREATED).send({ message: '회원가입 완료' });
  } catch (err) {
    handleError(res, err);
  }
};

/** 로그인 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isExist = await checkEmailExistence({ email });
    if (!isExist) {
      throwError('ER_NOT_FOUND_EMAIL');
    }

    const loginUser = await findUser({ email });
    if (!loginUser) {
      throwError('일치하는 회원 없음');
    }

    // 비밀번호 검증
    const matchPassword = await bcrypt.compare(password, loginUser.password);
    if (!matchPassword) {
      throwError('ER_NOT_MATCHED_PASSWORD');
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
  } catch (err) {
    handleError(res, err);
  }
};

/** 비밀번호 초기화 요청 */
const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const isExist = await checkEmailExistence({ email });
    if (!isExist) {
      throwError('ER_NOT_FOUND_EMAIL');
    }

    res.status(StatusCodes.OK).send({ email });
  } catch (err) {
    handleError(res, err);
  }
};

/** 비밀번호 초기화 */
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const isExist = await checkEmailExistence({ email });
    if (!isExist) {
      throwError('ER_NOT_FOUND_EMAIL');
    }

    const result = await updateUserPassword({ email, password: hashedPassword });
    if (!result) {
      throwError('비밀번호 초기화 오류');
    }
    res.status(StatusCodes.OK).send({ message: '비밀번호 초기화 성공' });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { joinUser, loginUser, requestResetPassword, resetPassword };
