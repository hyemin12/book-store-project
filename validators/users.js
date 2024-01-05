const { body } = require("express-validator");
const validateAndProceed = require("./validateAndProceed");

const getSqlQueryResult = require("../utils/getSqlQueryResult");

const validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("이메일은 필수 입력")
  .isEmail()
  .withMessage("이메일 형식이 올바르지 않음")
  .custom(async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const { conn, rows } = await getSqlQueryResult(sql, [email]);

    if (!rows.length) {
      throw new Error("일치하는 이메일이 없음");
    }

    conn.release();

    return true;
  });

const validateEmailForJoin = body("email")
  .trim()
  .notEmpty()
  .withMessage("이메일은 필수 입력")
  .isEmail()
  .withMessage("이메일 형식이 올바르지 않음")
  .custom(async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const { conn, rows } = await getSqlQueryResult(sql, [email]);

    if (rows.length > 0) {
      throw new Error("이미 등록된 이메일입니다.");
    }
    conn.release();

    return true;
  });

const validatePassword = body("password")
  .trim()
  .notEmpty()
  .withMessage("비밀번호는 필수 입력")
  .isLength({ min: 8, max: 16 })
  .withMessage("비밀번호는 8~16글자이어야 함");

const validatesJoin = [
  validateEmailForJoin,
  validatePassword,
  validateAndProceed,
];
const validatesLoginAndReset = [
  validateEmail,
  validatePassword,
  validateAndProceed,
];
const validatesEmail = [validateEmail, validateAndProceed];

module.exports = { validatesLoginAndReset, validatesJoin, validatesEmail };
