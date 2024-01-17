const jwt = require('jsonwebtoken');

const { throwError, handleError } = require('../utils/handleError');
const checkDataExistence = require('../utils/checkDataExistence');

const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;
const TOKEN_ISSUER = process.env.TOKEN_ISSUER;

const decodedJWT = (token) => {
  try {
    return jwt.verify(token, TOKEN_PRIVATE_KEY);
  } catch (err) {
    // 오류 미들웨어로 넘어가야하는 코드
    if (err instanceof jwt.TokenExpiredError) throwError('ER_SESSION_EXPIRED');
    if (err instanceof jwt.JsonWebTokenError) throwError('ER_INVALID_TOKEN');
    throwError('ER_UNKNOWN');
  }
};

const checkUserExistenceQuery = 'SELECT * from users WHERE id = ?';

/** token을 검증하고, 인증하는 함수
 * @param requireToken 로그인이 꼭 필요한지 여부
 */
const ensureAuthorization =
  (requireToken = true) =>
  async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token && requireToken) return handleError(res, 'ER_NO_TOKEN');

    try {
      if (token) {
        const decodedToken = decodedJWT(token);

        if (decodedToken.iss !== TOKEN_ISSUER) throwError(res, 'ER_INVALID_ISSUER');

        const { isExist } = await checkDataExistence(checkUserExistenceQuery, [decodedToken.id]);
        if (!isExist) {
          throwError(res, 'ER_INVALID_USER');
        }

        req.user = decodedToken;
      }
    } catch (err) {
      next(err);
    }
    next();
  };

module.exports = ensureAuthorization;
