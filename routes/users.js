const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const conn = require("../mysql");

dotenv.config();

const router = express.Router();
router.use(express.json());

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
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).send(errors.array());
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

router.post("/join", [validateEmail, validatePassword, validate], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    const values = [email, hashedPassword];

    const [rows] = await (await conn).execute(sql, values);

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

router.post("/login", [validateEmail, validatePassword, validate], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";

    const [rows] = await (await conn).execute(sql, [email]);
    const [loginUser] = rows;

    if (!loginUser) {
      return res.status(400).send({ message: "일치하는 이메일이 없음" });
    }

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

router
  .route("/reset")
  .post([validateEmail, validate], async (req, res, next) => {
    try {
      const { email } = req.body;
      const sql = "SELECT * FROM users WHERE email = ?";

      const [rows] = await (await conn).execute(sql, [email]);

      if (!rows.length) return res.status(404).send({ message: "일치하는 회원 없음" });

      res.status(200).send({ message: "비밀번호 초기화 요청" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "서버 오류" });
    }
  })
  .put([validateEmail, validatePassword, validate], async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await hashPassword(password);

      const sql = "UPDATE users SET password = ? WHERE email = ?";
      const values = [hashedPassword, email];
      const [rows] = await (await conn).execute(sql, values);

      if (rows.affectedRows > 0) {
        res.status(200).send({ message: "비밀번호 초기화 성공" });
      } else {
        res.status(400).send({ message: "비밀번호 변경 실패" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "서버 오류" });
    }
  });

module.exports = router;
