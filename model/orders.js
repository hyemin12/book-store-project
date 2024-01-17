const pool = require('../mysql');
const checkDataExistence = require('../utils/checkDataExistence');
const { getConnection, releaseConnection } = require('../utils/connectionUtil');
const { throwError } = require('../utils/handleError');

const checkDeliveryExistence = async ({ recipient, address, contact, conn }) => {
  try {
    const sql = `
      SELECT * from delivery 
      WHERE recipient = ? AND address = ? AND contact = ?
      `;
    const values = [recipient, address, contact];

    const { isExist, rows } = await checkDataExistence(sql, values, conn);

    return { isExist, dbDeliveryId: rows[0].id };
  } catch (error) {
    throwError(error);
  }
};

const createDelivery = async ({ recipient, address, contact, conn }) => {
  const sql = `
    INSERT INTO delivery 
    (recipient,address,contact) 
    VALUES (?,?,?)
  `;
  const values = [recipient, address, contact];

  const connection = getConnection(conn);
  const [rows] = await connection.execute(sql, values);
  releaseConnection(connection, conn);

  return { result: rows.affectedRows > 0, dbDeliveryId: rows.insertId };
};

const createOrder = async ({ bookTitle, totalQuantity, totalPrice, payment, deliveryId, userId, conn }) => {
  const sql = `
      INSERT INTO orders
      (book_title, total_quantity, total_price, payment, delivery_id, user_id)
      VALUES (?,?,?,?,?,?)
    `;
  const values = [bookTitle, totalQuantity, totalPrice, payment, deliveryId, userId];

  const connection = getConnection(conn);
  const [rows] = await connection.execute(sql, values);
  releaseConnection(connection, conn);

  return { result: rows.affectedRows > 0, orderId: rows.insertId };
};

const createOrderDetails = async ({ count, values, conn }) => {
  const sql = `
      INSERT INTO orderedbook
      (order_id, book_id, quantity)
      VALUES (?,?,?)${', (?,?,?)'.repeat(count)}
    `;

  const connection = getConnection(conn);
  const [rows] = await connection.execute(sql, values);
  releaseConnection(connection, conn);

  return rows.affectedRows > 0;
};

const findOrderList = async ({ userId }) => {
  const sql = `
      SELECT orders.id, created_at, recipient, address, contact, total_quantity, total_price
      FROM orders 
      LEFT JOIN delivery ON orders.delivery_id = delivery.id
      WHERE user_id = ? 
    `;
  const values = [userId];

  const [rows] = await pool.execute(sql, values);
  return rows;
};
const findOrderDetails = async ({ orderId }) => {
  const sql = `
    SELECT book_id, title AS book_title, author, price, quantity
    FROM orderedbook
    LEFT JOIN books ON orderedbook.book_id = books.id
    WHERE order_id = ? 
  `;
  const values = [orderId];

  const [rows] = await connection.execute(sql, values);
  return rows;
};

module.exports = {
  checkDeliveryExistence,
  createDelivery,
  createOrder,
  createOrderDetails,
  findOrderList,
  findOrderDetails
};
