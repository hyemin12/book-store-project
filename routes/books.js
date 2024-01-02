const express = require("express");
const { getAllBooks, getCategoryBooks, getSearchBooks, getIndividualBook } = require("../controller/booksController");

const router = express.Router();
router.use(express.json());

router.get("/", getAllBooks);

router.get("/category/:categoryId", getCategoryBooks);

router.get("/search", getSearchBooks);

router.get("/:bookId", getIndividualBook);

module.exports = router;
