const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleError = require('../utils/handleError');
const throwError = require('../utils/throwError');

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
    throw new Error('비밀번호 해싱 중 에러 발생');
  }
};

/** 이메일 존재 여부 확인 */
const checkEmailExistence = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  return checkExist(sql, [email]);
};

/** 회원가입 */
const joinUser = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  const values = [email, hashedPassword];

  try {
    const { isExist, conn } = await checkEmailExistence(email);

    if (isExist) {
      throwError('ER_ALREADY_EXISTS_EMAIL');
    }

    const { rows } = await getSqlQueryResult(sql, values, conn);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '회원가입 완료' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

/** 로그인 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  try {
    const { isExist, conn } = await checkEmailExistence(email);

    if (!isExist) {
      throwError('ER_NOT_FOUND_EMAIL');
    }

    const { rows } = await getSqlQueryResult(sql, [email], conn);
    const [loginUser] = rows;

    // 비밀번호 검증
    const matchPassword = await bcrypt.compare(password, loginUser.password);

    if (!matchPassword) {
      throwError('ER_NOT_MATCHED_PASSWORD');
    }

    // 토큰 생성
    const token = jwt.sign({ email }, TOKEN_PRIVATE_KEY, {
      expiresIn: '1h',
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
  } catch (err) {
    handleError(res, err);
  }
};

/** 비밀번호 초기화 요청 */
const requestResetPassword = async (req, res, next) => {
  const { email } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  try {
    const { rows } = await getSqlQueryResult(sql, [email]);

    res.status(StatusCodes.OK).send({ email: rows[0].email });
  } catch (err) {
    handleError(res, err);
  }
};

/** 비밀번호 초기화 */
const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  const values = [hashedPassword, email];

  try {
    const { rows } = await getSqlQueryResult(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '비밀번호 초기화 성공' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { joinUser, loginUser, requestResetPassword, resetPassword };
