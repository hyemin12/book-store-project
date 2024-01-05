const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getSqlQueryResult = require("../utils/getSqlQueryResult");
const handleServerError = require("../utils/handleServerError");

const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;
const TOKEN_ISSUER = process.env.TOKEN_ISSUER;
const saltRounds = process.env.SALT_ROUNDS || 10;
console.log("saltRounds", saltRounds);
// 비밀번호 해싱
const hashPasswordSync = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

const joinUser = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = hashPasswordSync(password);

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  const values = [email, hashedPassword];

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: "회원가입 완료" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "회원가입 실패" });
    }

    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const { rows, conn } = await getSqlQueryResult(sql, [email]);
    const [loginUser] = rows;

    if (!loginUser) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "일치하는 이메일이 없음" });

    const matchPassword = await bcrypt.compareSync(password, loginUser.password);
    if (!matchPassword) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "비밀번호 불일치" });

    const token = jwt.sign({ email }, TOKEN_PRIVATE_KEY, {
      expiresIn: "1h",
      issuer: TOKEN_ISSUER,
    });

    res
      .status(StatusCodes.OK)
      .cookie("access_token", token, {
        httpOnly: true,
        // https 연결에서만 쿠키 발급되도록 설정
        secure: process.env.NODE_ENV === "production",
      })
      .send({ message: "로그인 성공" });
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const requestResetPassword = async (req, res, next) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const { rows, conn } = await getSqlQueryResult(sql, [email]);

    if (!rows.length) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "일치하는 회원 없음" });

    res.status(StatusCodes.OK).send({ email });
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = hashPasswordSync(password);

  const sql = "UPDATE users SET password = ? WHERE email = ?";
  const values = [hashedPassword, email];

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: "비밀번호 초기화 성공" });
    } else {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ message: "비밀번호 변경 실패" });
    }
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

module.exports = { joinUser, loginUser, requestResetPassword, resetPassword };
