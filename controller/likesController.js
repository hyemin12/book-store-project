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

  try {
    const { rows: rowsDuplicate, conn } = await getSqlQueryResult(
      sqlCheckDuplicate,
      values,
      undefined,
      true
    );

    if (rowsDuplicate.length > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: '이미 좋아요를 추가한 책입니다.' });
      conn.release();
      return;
    }

    const sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';

    const { rows } = await getSqlQueryResult(sql, values, conn);
    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '좋아요 추가 성공' });
    }
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
    const { rows } = await getSqlQueryResult(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '좋아요 삭제 성공' });
    }
  } catch (err) {
    handleServerError(res, err);
  }
};

module.exports = { postLike, deleteLike };
