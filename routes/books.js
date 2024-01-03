const express = require("express");
const { getAllBooks, getBooksByCategory, getSearchBooks, getIndividualBook } = require("../controller/booksController");

const router = express.Router();
router.use(express.json());

router.get("/", getAllBooks);

router.get("/category/:categoryId", getBooksByCategory);

router.get("/search", getSearchBooks);

router.get("/:bookId", getIndividualBook);

module.exports = router;
