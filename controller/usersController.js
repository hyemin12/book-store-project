const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const conn = require("../mysql");
const jwt = require("jsonwebtoken");

dotenv.config();

const TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY;

const validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("이메일은 필수 입력")
  .isEmail()
  .withMessage("이메일 형식이 올바르지 않음");
const validatePassword = body("password")
  .trim()
  .notEmpty()
  .withMessage("비밀번호는 필수 입력")
  .isLength({ min: 8, max: 16 })
  .withMessage("비밀번호는 8~14글자이어야 함");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(StatusCodes.BAD_REQUEST).send(errors.array());
};
const validates = [validateEmail, validatePassword, validate];
const validatesEmail = [validateEmail, validate];

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const joinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    const values = [email, hashedPassword];

    const [rows] = await (await conn).execute(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: "회원가입 완료" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "회원가입 실패" });
    }
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "서버 오류" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await (await conn).execute(sql, [email]);
    const [loginUser] = rows;

    if (!loginUser) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "일치하는 이메일이 없음" });

    const matchPassword = await bcrypt.compare(password, loginUser.password);
    if (!matchPassword) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "비밀번호 불일치" });

    const token = jwt.sign({ email }, TOKEN_PRIVATE_KEY, {
      expiresIn: "1h",
      issuer: "hyemin",
    });

    res
      .status(StatusCodes.OK)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .send({ message: "로그인 성공" });
    console.log(token);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "서버 오류" });
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
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "서버 오류" });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const sql = "UPDATE users SET password = ? WHERE email = ?";
    const values = [hashedPassword, email];
    const [rows] = await (await conn).execute(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: "비밀번호 초기화 성공" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "비밀번호 변경 실패" });
    }
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "서버 오류" });
  }
};

module.exports = { validates, validatesEmail, joinUser, loginUser, requestResetPassword, resetPassword };
