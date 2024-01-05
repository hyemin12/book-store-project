const express = require("express");
const router = express.Router();
const { postLike, deleteLike } = require("../controller/likesController");

router.use(express.json());

router.route("/:bookId").post(postLike).delete(deleteLike);

module.exports = router;
