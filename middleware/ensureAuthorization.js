const jwt = require('jsonwebtoken');

const { UnauthorizedError, ServerError, UnProcessableError, NotFoundError } = require('../utils/errors');
const checkDataExistence = require('../utils/checkDataExistence');

const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;
const TOKEN_ISSUER = process.env.TOKEN_ISSUER;

const decodedJWT = (token) => {
  try {
    return jwt.verify(token, TOKEN_PRIVATE_KEY);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError)
      throw new UnauthorizedError('로그인(인증) 세션이 만료', 'ER_SESSION_EXPIRED');

    if (err instanceof jwt.JsonWebTokenError) throw new UnauthorizedError('유효하지 않은 토큰', 'ER_INVALID_TOKEN');

    throw new ServerError();
  }
};

const checkUserExistenceQuery = 'SELECT * from users WHERE id = ?';

const parseCookieHeader = (cookieHeader) => {
  const cookies = cookieHeader.split(';');
  let token = null;
  for (cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key.trim() === 'token') return (token = value);
  }
  return token;
};

/** token을 검증하고, 인증하는 함수
 * @param requireToken 로그인이 꼭 필요한지 여부
 */
const ensureAuthorization =
  (requireToken = true) =>
  async (req, res, next) => {
    try {
      let token = req.headers['authorization'];
      if (token === '') {
        token = parseCookieHeader(req.headers.cookie);
      }

      if (!token && requireToken) throw new UnauthorizedError('토큰 없음', 'ER_NO_TOKEN');

      if (token) {
        const decodedToken = decodedJWT(token);

        if (decodedToken.iss !== TOKEN_ISSUER) throw new UnProcessableError('잘못된 토큰 발급자', 'ER_INVALID_ISSUER');

        const { isExist } = await checkDataExistence(checkUserExistenceQuery, [decodedToken.id]);
        if (!isExist) {
          throw new NotFoundError('사용자를 찾을 수 없음', 'ER_NOT_FOUND_USER');
        }

        req.user = decodedToken;
      }
    } catch (err) {
      next(err);
    }
    next();
  };

module.exports = ensureAuthorization;
