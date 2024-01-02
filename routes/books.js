const express = require("express");
const conn = require("../mysql");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM books";
    const [rows] = await (await conn).execute(sql);
    res.status(200).send({ lists: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
});

const filteredRecentBooks = (books) => {
  const newBooksPeriod = new Date();
  newBooksPeriod.setMonth(newBooksPeriod.getMonth() - 1);

  return books.filter((book) => {
    const publishedDate = new Date(book.published_at);
    return publishedDate >= newBooksPeriod;
  });
};

router.get("/category/:categoryId", async (req, res, next) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const isFilteredRecentBooks = req.query.new;

    const sql = "SELECT * FROM books WHERE category_id = ?";
    const [rows] = await (await conn).execute(sql, [categoryId]);

    if (isFilteredRecentBooks) return res.status(200).send({ lists: filteredRecentBooks(rows) });

    res.status(200).send({ lists: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
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
