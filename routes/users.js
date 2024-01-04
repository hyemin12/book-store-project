const express = require("express");
const { joinUser, loginUser, requestResetPassword, resetPassword } = require("../controller/usersController");
const { validatesEmailPassword, validatesEmail } = require("../validators/users");

const router = express.Router();
router.use(express.json());

router.post("/join", validatesEmailPassword, joinUser);

router.post("/login", validatesEmailPassword, loginUser);

router.route("/reset").post(validatesEmail, requestResetPassword).put(validatesEmailPassword, resetPassword);

module.exports = router;
