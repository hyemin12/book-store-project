const pool = require('../mysql');
const checkDataExistence = require('../utils/checkDataExistence');
const { getConnection, releaseConnection } = require('../utils/connectionUtil');
const { throwError } = require('../utils/handleError');

const checkCartItemExistence = async ({ userId, bookId }) => {
  try {
    const sql = 'SELECT * FROM cartItems WHERE user_id = ? AND book_id = ?';
    const values = [userId, bookId];
    const { isExist, rows } = await checkDataExistence(sql, values);

    return { isExist, cartItemId: rows[0].id, dbQuantity: rows[0].quantity };
  } catch (error) {}
};

const findCartItems = async ({ userId, selected }) => {
  try {
    let sql = `
      SELECT 
      cartItems.id, book_id, title, summary, price, quantity 
      FROM cartItems 
      LEFT JOIN books ON cartItems.book_id = books.id
      WHERE user_id = ?
    `;
    const values = [userId];

    if (selected) {
      sql += ` AND cartItems.id IN (?${',?'.repeat(selected.length - 1)})`;
      values.push(...selected);
    }

    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error) {
    throwError('장바구니 조회 오류');
  }
};

const createCartItem = async ({ quantity, bookId, userId }) => {
  try {
    const sql = 'INSERT INTO cartItems (book_id,quantity,user_id) VALUES (?,?,?)';
    const values = [bookId, quantity, userId];
    const [rows] = await pool.execute(sql, values);
    return rows.affectedRows > 0;
  } catch (error) {
    throwError('장바구니 아이템 담기 오류');
  }
};

const updateCartItem = async () => {
  try {
    const sql = 'UPDATE cartItems SET quantity = ? WHERE id = ?';
    const values = [quantity, id];
    const [rows] = await pool.execute(sql, values);
    return rows.affectedRows > 0;
  } catch (error) {
    throwError('장바구니 아이템 수량 변경 오류');
  }
};

const deleteCartItems = async ({ id, idArr, count, conn }) => {
  try {
    const sql = `
      DELETE FROM cartItems
      WHERE id IN (?${',?'.repeat(count)})
    `;
    const values = count ? idArr : [id];

    const connection = getConnection(conn);
    const [rows] = await connection.execute(sql, values);
    releaseConnection(connection, conn);

    return rows.affectedRows > 0;
  } catch (error) {
    throwError('장바구니 아이템 삭제 오류');
  }
};

module.exports = { checkCartItemExistence, findCartItems, createCartItem, updateCartItem, deleteCartItems };
