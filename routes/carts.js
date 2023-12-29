const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .route("/")
  .post(async (req, res, next) => {
    const { book_id, quantity } = req.body;
    res.status(201).send({ message: "장바구니 추가" });
  })
  .get(async (req, res, next) => {
    res.status(200).send({ message: "장바구니 조회" });
  });

router.route("/order").get(async (req, res, next) => {
  res.status(200).send({ message: "장바구니에서 선택한 상품 목록 조회" });
});

module.exports = router;
