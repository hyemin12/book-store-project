const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const conn = require("../mysql");
const jwt = require("jsonwebtoken");

const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;

// 비밀번호 해싱
const hashPasswordSync = (password) => {
  return bcrypt.hashSync(password, 10);
};

// 서버 오류 핸들러
const handleError = (res, error) => {
  console.error(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error" });
};

const joinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPasswordSync(password);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    const values = [email, hashedPassword];

    const [rows] = await (await conn).execute(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: "회원가입 완료" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "회원가입 실패" });
    }
  } catch (err) {
    handleError(res, err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await (await conn).execute(sql, [email]);
    const [loginUser] = rows;

    if (!loginUser) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "일치하는 이메일이 없음" });

    const matchPassword = await bcrypt.compareSync(password, loginUser.password);
    if (!matchPassword) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "비밀번호 불일치" });

    const token = jwt.sign({ email }, TOKEN_PRIVATE_KEY, {
      expiresIn: "1h",
      issuer: "hyemin",
    });

    res
      .status(StatusCodes.OK)
      .cookie("access_token", token, {
        httpOnly: true,
        // https 연결에서만 쿠키 발급되도록 설정
        secure: process.env.NODE_ENV === "production",
      })
      .send({ message: "로그인 성공" });
    console.log(token);
  } catch (err) {
    handleError(res, err);
  }
};

const requestResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await (await conn).execute(sql, [email]);

    if (!rows.length) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "일치하는 회원 없음" });

    res.status(StatusCodes.OK).send({ email });
  } catch (err) {
    handleError(res, err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPasswordSync(password);

    const sql = "UPDATE users SET password = ? WHERE email = ?";
    const values = [hashedPassword, email];
    const [rows] = await (await conn).execute(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: "비밀번호 초기화 성공" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "비밀번호 변경 실패" });
    }
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { validates, validatesEmail, joinUser, loginUser, requestResetPassword, resetPassword };
