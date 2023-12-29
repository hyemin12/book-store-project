const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .get(async (req, res, next) => {
    res.status(200).send({ message: "전체 도서 조회" });
  })
  .put("/:category", async (req, res, next) => {
    const { category } = req.params;
    const newBookCheckStatus = req.query.new;
    res.status(200).send({ message: "카테고리별 조회" });
  });

router.get("/search", async (req, res, next) => {
  const { query } = req.query;
  res.status(200).send({ message: "도서 검색", query });
});

router.get("/:bookId", async (req, res, next) => {
  const { bookId } = req.params;
  res.status(200).send({ message: "개별 도서 조회" });
});

module.exports = router;
