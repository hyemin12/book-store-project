const express = require("express");
const {
  validates,
  validatesEmail,
  joinUser,
  loginUser,
  requestResetPassword,
  resetPassword,
} = require("../controller/usersController");

const router = express.Router();
router.use(express.json());

router.post("/join", validates, joinUser);

router.post("/login", validates, loginUser);

router.route("/reset").post(validatesEmail, requestResetPassword).put(validates, resetPassword);

module.exports = router;
