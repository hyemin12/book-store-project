const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

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

const validateAndProceed = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(StatusCodes.BAD_REQUEST).send(errors.array());
};
const validatesEmailPassword = [validateEmail, validatePassword, validateAndProceed];
const validatesEmail = [validateEmail, validateAndProceed];

module.exports = { validatesEmailPassword, validatesEmail };
