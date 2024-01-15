const express = require('express');
const router = express.Router();

const { joinUser, loginUser, requestResetPassword, resetPassword } = require('../controller/usersController');
const { validatesLoginAndReset, validatesJoin, validatesEmail } = require('../validators/users');

router.post('/join', validatesJoin, joinUser);

router.post('/login', validatesLoginAndReset, loginUser);

router.route('/reset').post(validatesEmail, requestResetPassword).put(validatesLoginAndReset, resetPassword);

module.exports = router;
