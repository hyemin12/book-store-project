const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ENV KEY
const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;
const TOKEN_ISSUER = process.env.TOKEN_ISSUER;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

if (!TOKEN_PRIVATE_KEY || !TOKEN_ISSUER) {
  throw new Error('환경변수가 제대로 설정되지 않았습니다.');
}

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new ServerError('비밀번호 해싱 중 에러 발생');
  }
};

const comparePassword = async (password, loginUserPassword) => {
  try {
    return await bcrypt.compare(password, loginUserPassword);
  } catch (error) {
    throw new ServerError('비밀번호 확인 중 에러 발생');
  }
};

const generateToken = (loginUser) => {
  const { email, id } = loginUser;
  return jwt.sign({ email, id }, TOKEN_PRIVATE_KEY, {
    expiresIn: '30m',
    issuer: TOKEN_ISSUER
  });
};

module.exports = { hashPassword, comparePassword, generateToken };
