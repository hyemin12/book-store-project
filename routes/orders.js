const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .route("/")
  .post(async (req, res, next) => {
    const { lists, delivery, payment, totalPrice } = req.body;
    res.status(200).send({ message: "결제하기" });
  })
  .get(async (req, res, next) => {
    res.status(200).send({ message: "주문 내역 조회" });
  });

router.get("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  res.status(200).send({ message: "상세 내역 조회" });
});

module.exports = router;
