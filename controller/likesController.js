const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

const postLike = async (req, res, next) => {
  const { bookId } = req.params;
  const { user_id } = req.body;

  const sqlCheckDuplicate = `
    SELECT * FROM likes 
    WHERE user_id = ? AND book_id = ?
  `;
  const values = [user_id, bookId];

  const { rows, conn } = await getSqlQueryResult(sqlCheckDuplicate, values);

  if (rows.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: '이미 좋아요를 추가한 책입니다.' });
  }
  const sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';

  try {
    const { rows } = await getSqlQueryResult(sql, values, conn);
    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '좋아요 추가 성공' });
    }
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

const deleteLike = async (req, res, next) => {
  const { bookId } = req.params;
  const { user_id } = req.body;

  const sql = `
  DELETE FROM likes
  WHERE user_id = ? AND book_id = ?
  `;
  const values = [user_id, bookId];

  try {
    const { rows, conn } = await getSqlQueryResult(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '좋아요 삭제 성공' });
    }
    conn.release();
  } catch (err) {
    handleServerError(res, err);
  }
};

module.exports = { postLike, deleteLike };
