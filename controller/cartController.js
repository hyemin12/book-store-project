const { StatusCodes } = require('http-status-codes');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleError = require('../utils/handleError');
const checkExist = require('../utils/checkExist');
const throwError = require('../utils/throwError');

/** 장바구니 아이템 수량 변경 */
const updateCartItemQuantity = async (itemId, newQuantity, conn) => {
  const sql = 'UPDATE cartItems SET quantity = ? WHERE id = ?';
  const values = [newQuantity, itemId];
  return await getSqlQueryResult(sql, values, conn);
};

/** 장바구니에 아이템 추가
 * 이미 장바구니에 존재하는 아이템이라면 수량을 1 증가시킴
 */
const addToCart = async (req, res) => {
  const { user_id, book_id, quantity } = req.body;

  const checkExistItemSql = `
    SELECT * FROM cartItems 
    WHERE user_id = ? AND book_id = ?
  `;

  try {
    const {
      rows: rowsExist,
      isExist,
      conn
    } = await checkExist(checkExistItemSql, [user_id, book_id]);

    // 존재하는 경우 장바구니에 있는 수량 1 더하기
    if (isExist) {
      const { id, quantity } = rowsExist[0];
      const addQuantity = quantity + 1;
      const updateResult = await updateCartItemQuantity(id, addQuantity, conn);

      if (updateResult.rows.affectedRows > 0) {
        return res
          .status(StatusCodes.OK)
          .send({ message: `이미 존재하는 아이템! ${addQuantity}` });
      } else {
        throwError(ERROR_UNPROCESSABLE_ENTITY);
      }
    }

    const sql =
      'INSERT INTO cartItems (book_id,quantity,user_id) VALUES (?,?,?)';
    const values = [book_id, quantity, user_id];
    const { rows } = await getSqlQueryResult(sql, values, conn);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '장바구니에 추가완료 ' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

/** 장바구니의 아이템 조회
 * selected: 선택된 아이템의 목록
 */
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
    handleError(res, err);
  }
};

/** 장바구니의 아이템 삭제 */
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
    handleError(res, err);
  }
};

/** 장바구니의 아이템 수량 변경 */
const updateCartItemCount = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const updateResult = await updateCartItemQuantity(id, quantity, undefined);
    if (updateResult.rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '수량 변경 성공' });
    }
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  addToCart,
  deleteCartsItem,
  getCartsItems,
  updateCartItemCount
};
