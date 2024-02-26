const pool = require('../mysql');
const checkDataExistence = require('../utils/checkDataExistence');
const { getConnection, releaseConnection } = require('../utils/connectionUtil');

const checkCartItemExistence = async ({ userId, bookId }) => {
  const sql = 'SELECT * FROM cartItems WHERE user_id = ? AND book_id = ?';
  const values = [userId, bookId];
  const { isExist, rows } = await checkDataExistence(sql, values);

  return { isExist, cartItemId: rows[0].id, cartItemDBQuantity: rows[0].quantity };
};

const findCartItems = async ({ userId, selected }) => {
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
};

const createCartItem = async ({ quantity, bookId, userId }) => {
  const sql = 'INSERT INTO cartItems (book_id,quantity,user_id) VALUES (?,?,?)';
  const values = [bookId, quantity, userId];

  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows > 0;
};

const updateCartItem = async () => {
  const sql = 'UPDATE cartItems SET quantity = ? WHERE id = ?';
  const values = [quantity, id];

  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows > 0;
};

const deleteCartItems = async ({ id, idArr, count, conn }) => {
  const sql = `
      DELETE FROM cartItems
      WHERE id IN (?${',?'.repeat(count)})
    `;
  const values = count ? idArr : [id];

  const connection = getConnection(conn);
  const [rows] = await connection.execute(sql, values);
  releaseConnection(connection, conn);

  return rows.affectedRows > 0;
};

module.exports = { checkCartItemExistence, findCartItems, createCartItem, updateCartItem, deleteCartItems };
