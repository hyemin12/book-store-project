const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const conn = require("../mysql");
const bcrypt = require("bcrypt");

dotenv.config();

router.use(express.json());

const emailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("이메일은 필수 입력")
  .isEmail()
  .withMessage("이메일 형식이 올바르지 않음");

const passwordValidation = body("password")
  .trim()
  .notEmpty()
  .withMessage("비밀번호는 필수 입력")
  .isLength({
    min: 8,
    max: 16,
  })
  .withMessage("비밀번호는 8~14글자이어야함");

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) return next();
  return res.status(400).send(err.array());
};

router.post("/join", [emailValidation, passwordValidation, validate], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    const values = [email, hashedPassword];

    const [rows] = await (await conn).execute(sql, [values]);

    if (rows.affectedRows > 0) {
      res.status(200).send({ message: "회원가입 완료" });
    } else {
      res.status(400).send({ message: "회원가입 실패" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
});

module.exports = router;

router.post("/login", [emailValidation, passwordValidation, validate], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = (?)";

    const [rows] = await (await conn).execute(sql, [email]);
    const [loginUser] = rows;

    console.log(rows, loginUser);
    if (!rows.length) return res.status(400).send({ message: "일치하는 이메일이 없음" });

    const passwordMatch = await bcrypt.compare(password, loginUser.password);

    if (!passwordMatch) {
      return res.status(404).send({ message: "비밀번호 불일치" });
    }

    res.status(200).send({ message: "로그인 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
});
