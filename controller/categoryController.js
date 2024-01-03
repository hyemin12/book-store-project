const { StatusCodes } = require("http-status-codes");
const conn = require("../mysql");

const getCategory = async (req, res, next) => {
  try {
    const sql = "SELECT * FROM category";
    const [rows] = await (await conn).execute(sql);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "서버 오류" });
  }
};

module.exports = { getCategory };
