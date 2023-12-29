const express = require("express");
const router = express.Router();

router.use(express.json());

router
  .route("/:bookId")
  .post(async (req, res, next) => {
    const { bookId } = req.params;
    res.status(200).send({ message: "좋아요 클릭" });
  })
  .delete(async (req, res, next) => {
    const { bookId } = req.params;
    res.status(200).send({ message: "좋아요 취소" });
  });

module.exports = router;
