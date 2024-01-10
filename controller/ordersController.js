const { StatusCodes } = require('http-status-codes');
const mysql = require('../mysql');

const getSqlQueryResult = require('../utils/getSqlQueryResult');
const handleServerError = require('../utils/handleServerError');

/** 주문 하기 (결제 하기) */
const postOrder = async (req, res, next) => {
  const {
    lists,
    delivery,
    payment,
    totalPrice,
    user_id,
    totalQuantity,
    FirstBookTitle
  } = req.body;

  // delivery table sql문
  const sqlDelivery = `
    INSERT INTO delivery 
    (recipient,address,contact) 
    VALUES (?,?,?)
  `;
  const valuesDelivery = [
    delivery.recipient,
    delivery.address,
    delivery.contact
  ];

  let conn = await mysql.getConnection();

  try {
    // Delivery 데이터 삽입
    const { rows: rowsDelivery } = await getSqlQueryResult(
      sqlDelivery,
      valuesDelivery,
      conn,
      true
    );
    const delivery_id = rowsDelivery.insertId;

    // orders table sql문
    const sqlOrders = `
      INSERT INTO orders 
      (book_title, total_quantity, total_price, payment, delivery_id, user_id) 
      VALUES (?,?,?,?,?,?)
    `;
    const valuesOrders = [
      FirstBookTitle,
      totalQuantity,
      totalPrice,
      payment,
      delivery_id,
      user_id
    ];

    // Orders 데이터 삽입
    const { rows: rowsOrders } = await getSqlQueryResult(
      sqlOrders,
      valuesOrders,
      conn,
      true
    );
    const order_id = rowsOrders.insertId;

    // orderedbook table sql문
    const sqlOrderedBook = `
      INSERT INTO orderedbook 
      (order_id,book_id,quantity) 
      VALUES (?,?,?)${', (?,?,?)'.repeat(lists.length - 1)}
    `;
    let valuesOrderedBook = [];
    let valuesDeleteCart = [];
    lists.forEach((item) => {
      valuesOrderedBook.push(order_id, item.id, item.quantity);
      valuesDeleteCart.push(item.cartItem_id);
    });

    // Orderedbook 데이터 삽입
    const { rows: rowsOrderedBook } = await getSqlQueryResult(
      sqlOrderedBook,
      valuesOrderedBook,
      conn,
      true
    );

    // 장바구니 내역 삭제 sql문
    const sqlDeleteCart = `
      DELETE FROM cartItems
      WHERE id IN (?${',?'.repeat(lists.length - 1)})
    `;
    // CartItems 정보 삭제
    const { rows: rowsDeleteCart } = await getSqlQueryResult(
      sqlDeleteCart,
      valuesDeleteCart,
      conn,
      true
    );

    // Commit the transaction
    await conn.commit();

    res
      .status(StatusCodes.OK)
      .send({ message: '결제 성공 및 장바구니 아이템 삭제' });
  } catch (err) {
    await conn.rollback();
    handleServerError(res, err);
  } finally {
    conn.release();
  }
};

/** 주문 내역 조회 */
const getOrders = async (req, res, next) => {
  const sql = `
  SELECT * FROM orders 
  LEFT JOIN delivery ON delivery.id = orders.delivery_id
  `;
  try {
    const { rows } = await getSqlQueryResult(sql);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (error) {
    handleServerError(res, err);
  }
};

/** 주문 내역 상세 조회 */
const getOrderDetail = async (req, res, next) => {
  const { orderId } = req.params;
  res.status(StatusCodes.OK).send({ message: '상세 내역 조회' });
};

module.exports = { postOrder, getOrders, getOrderDetail };
