const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

const addToCart = async (req, res) => {
  const { user_id, book_id, quantity } = req.body;

  const sqlCheckDuplicate = `
    SELECT * FROM cartItems 
    WHERE user_id = ? AND book_id = ?
  `;
  const valuesCheckDuplicate = [user_id, book_id];

  try {
    const { rows: rowsDuplicate, conn } = await getSqlQueryResult(
      sqlCheckDuplicate,
      valuesCheckDuplicate,
      undefined,
      true
    );
    if (rowsDuplicate.length > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: '이미 추가되어 있는 상품입니다.' });
      conn.release();
      return;
    }

    const sql =
      'INSERT INTO cartItems (book_id,quantity,user_id) VALUES (?,?,?)';
    const values = [book_id, quantity, user_id];

    const { rows } = await getSqlQueryResult(sql, values, conn);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.CREATED).send({ message: '장바구니 추가 성공' });
    }
  } catch (err) {
    handleServerError(res, err);
  }
};

const getCartsItems = async (req, res) => {
  const { user_id, selected } = req.body;

  let sql = `SELECT 
    cartItems.id, book_id, title, summary, price, quantity 
    FROM cartItems 
    LEFT JOIN books ON cartItems.book_id = books.id
    WHERE user_id = ?
		`;
  const values = [user_id];

  if (selected) {
    sql += `AND cartItems.id IN (?${',?'.repeat(selected.length - 1)})`;
    values.push(...selected);
  }

  try {
    const { rows } = await getSqlQueryResult(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleServerError(res, err);
  }
};

const deleteCartsItem = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM cartItems
        WHERE id = ? `;

  try {
    const { rows } = await getSqlQueryResult(sql, [id]);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '아이템 삭제 성공' });
    }
  } catch (err) {
    handleServerError(res, err);
  }
};

const updateCartItemCount = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sql = `UPDATE cartItems SET quantity = ? 
		WHERE id = ?`;
  const values = [quantity, id];

  try {
    const { rows } = await getSqlQueryResult(sql, values);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '수량 변경 성공' });
    }
  } catch (err) {
    handleServerError(res, err);
  }
};

module.exports = {
  addToCart,
  deleteCartsItem,
  getCartsItems,
  updateCartItemCount
};
