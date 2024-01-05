const express = require("express");
const {
  joinUser,
  loginUser,
  requestResetPassword,
  resetPassword,
} = require("../controller/usersController");
const {
  validatesLoginAndReset,
  validatesJoin,
  validatesEmail,
} = require("../validators/users");

const router = express.Router();
router.use(express.json());

router.post("/join", validatesJoin, joinUser);

router.post("/login", validatesLoginAndReset, loginUser);

router
  .route("/reset")
  .post(validatesEmail, requestResetPassword)
  .put(validatesLoginAndReset, resetPassword);

module.exports = router;
