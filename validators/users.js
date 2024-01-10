const { body } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateAndProceed = require('./validateAndProceed');
const getSqlQueryResult = require('../utils/getSqlQueryResult');

const validateEmail = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일은 필수 입력')
  .isEmail()
  .withMessage('이메일 형식이 올바르지 않음');

const validateEmailForJoin = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일은 필수 입력')
  .isEmail()
  .withMessage('이메일 형식이 올바르지 않음');

const validatePassword = body('password')
  .trim()
  .notEmpty()
  .withMessage('비밀번호는 필수 입력')
  .isLength({ min: 8, max: 16 })
  .withMessage('비밀번호는 8~16글자이어야 함');

const validatesJoin = [
  validateEmailForJoin,
  validatePassword,
  validateAndProceed
];
const validatesLoginAndReset = [
  validateEmail,
  validatePassword,
  validateAndProceed
];
const validatesEmail = [validateEmail, validateAndProceed];

module.exports = { validatesLoginAndReset, validatesJoin, validatesEmail };
