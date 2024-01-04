const express = require("express");
const { getBooks, getSearchBooks, getIndividualBook } = require("../controller/booksController");

const router = express.Router();
router.use(express.json());

router.get("/", getBooks);
router.get("/search", getSearchBooks);
router.get("/:bookId", getIndividualBook);

module.exports = router;
