const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const { handleError, throwError } = require('../utils/handleError');
const checkDataExistence = require('../utils/checkDataExistence');

/** 장바구니에 아이템 추가
 * 이미 장바구니에 존재하는 아이템이라면 수량을 1 증가시킴
 */
const addToCart = async (req, res) => {
  const { bookId, quantity } = camelcaseKeys(req.body);

  try {
    const userId = req.user.id;

    // Step 1: 도서가 DB에 존재하는지 확인
    const { isExist: isExistBook, conn } = await checkDataExistence('book', [
      bookId
    ]);

    if (!isExistBook) {
      throwError('NOT_FOUND');
    }

    // Step 2: 장바구니에 이미 담겨있는 아이템인지 확인
    const { rows: rowsExistCartItem, isExist: isExistItemToCart } =
      await checkDataExistence('itemToCart', [userId, bookId], conn);

    // 존재하는 경우 장바구니에 있는 수량 1 더하기
    if (isExistItemToCart) {
      const { id, quantity } = rowsExistCartItem[0];
      const addQuantity = quantity + 1;
      const { rows } = await updateCartItemQuantity(id, addQuantity, conn);

      if (rows.affectedRows > 0) {
        return res.status(StatusCodes.OK).send({
          message: `이미 존재하는 아이템!  수량 추가. 
            변경된 수량: ${addQuantity}`
        });
      } else {
        throwError(ERROR_UNPROCESSABLE_ENTITY);
      }
    }

    const sql =
      'INSERT INTO cartItems (book_id,quantity,user_id) VALUES (?,?,?)';
    const values = [bookId, quantity, userId];

    // Step 3: 장바구니에 담기
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
  const { selected } = req.body;

  try {
    const userId = req.user.id;

    let sql = `SELECT 
      cartItems.id, book_id, title, summary, price, quantity 
      FROM cartItems 
      LEFT JOIN books ON cartItems.book_id = books.id
      WHERE user_id = ?`;
    const values = [userId];

    if (selected) {
      sql += ` AND cartItems.id IN (?${',?'.repeat(selected.length - 1)})`;
      values.push(...selected);
    }

    const { rows } = await getSqlQueryResult(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleError(res, err);
  }
};

/** 장바구니의 아이템 삭제 */
const deleteCartsItem = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM cartItems WHERE id = ?';

  try {
    const { rows } = await getSqlQueryResult(sql, [id]);

    if (rows.affectedRows > 0) {
      res.status(StatusCodes.OK).send({ message: '아이템 삭제 성공' });
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
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
    } else {
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    handleError(res, err);
  }
};

/** 장바구니 아이템 수량 변경 */
const updateCartItemQuantity = async (itemId, newQuantity, conn) => {
  const sql = 'UPDATE cartItems SET quantity = ? WHERE id = ?';
  const values = [newQuantity, itemId];
  return await getSqlQueryResult(sql, values, conn);
};

module.exports = {
  addToCart,
  deleteCartsItem,
  getCartsItems,
  updateCartItemCount
};
