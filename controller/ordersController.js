const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const pool = require('../mysql');

const { handleError, throwError } = require('../utils/handleError');
const checkDataExistence = require('../utils/checkDataExistence');

const checkDeliveryExistenceQuery = 'SELECT * from delivery WHERE recipient = ? AND address = ? AND contact = ?';

/* 주문 프로세스
 * 1. 클라이언트에서 전달받은 delivery 데이터가 delivery 테이블에 존재하는지 확인
 *    - 존재한다면 데이터베이스에 찾은 값을 delivery_id에 할당
 *    - 존재하지 않는다면 delivery 테이블에 데이터를 추가하고, 추가된 delivery_id를 할당
 * 2. orders 테이블에 주문 내역 추가하기
 * 3. orderbook 테이블에 주문한 도서 목록 데이터 추가하기
 * 4. 장바구니 목록에서 주문한 도서 목록 삭제하기
 */
/** 주문하기 (결제 하기) */
const postOrder = async (req, res) => {
  const { books, delivery, payment, totalPrice, totalQuantity, firstBookTitle } = camelcaseKeys(req.body);

  const userId = req.user?.id ?? undefined;

  const sqlDelivery = `
    INSERT INTO delivery 
    (recipient,address,contact) 
    VALUES (?,?,?)
  `;
  const valuesDelivery = [delivery.recipient, delivery.address, delivery.contact];

  let deliveryId = 0;
  const booksLength = books.length - 1;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Step 1: Delivery 정보 확인 및 추가
    const { isExist, rows: rowsExistDelivery } = await checkDataExistence(checkDeliveryExistenceQuery, valuesDelivery);
    if (isExist) {
      deliveryId = rowsExistDelivery[0].id;
    } else {
      const [rows] = await conn.execute(sqlDelivery, valuesDelivery);
      deliveryId = rows.insertId;
    }

    const sqlOrders = `
      INSERT INTO orders
      (book_title, total_quantity, total_price, payment, delivery_id, user_id)
      VALUES (?,?,?,?,?,?)
    `;
    const valuesOrders = [firstBookTitle, totalQuantity, totalPrice, payment, deliveryId, userId];

    // Step 2: Orders 테이블에 주문 내역 추가
    const [rows] = await conn.execute(sqlOrders, valuesOrders);

    const orderId = rows.insertId;

    const sqlOrderedBook = `
      INSERT INTO orderedbook
      (order_id, book_id, quantity)
      VALUES (?,?,?)${', (?,?,?)'.repeat(booksLength)}
    `;
    const valuesOrderedBook = [];
    const valuesDeleteCart = [];
    books.forEach((item) => {
      valuesOrderedBook.push(orderId, item.book_id, item.quantity);
      valuesDeleteCart.push(item.cartItem_id);
    });

    // Step 3: OrderedBook 테이블에 주문한 도서 목록 추가
    await conn.execute(sqlOrderedBook, valuesOrderedBook);

    const sqlDeleteCart = `
    DELETE FROM cartItems
    WHERE id IN (?${',?'.repeat(booksLength)})
  `;

    // Step 4: 장바구니 목록에서 주문한 도서 목록 삭제
    const [result] = await conn.execute(sqlDeleteCart, valuesDeleteCart);

    if (result.affectedRows > 0) {
      // Step 5: 변경내역 확정
      await conn.commit();
      res.status(StatusCodes.OK).send({ message: '결제 성공 및 장바구니 아이템 삭제' });
    } else {
      console.error('장바구니 아이템 삭제 실패');
      throwError('ER_UNPROCESSABLE_ENTITY');
    }
  } catch (err) {
    await conn.rollback();
    handleError(res, err);
  } finally {
    if (conn) conn.release();
  }
};

/** 주문 내역 조회 */
const getOrders = async (req, res) => {
  const userId = req.user?.id ?? undefined;

  const sql = `
    SELECT orders.id, created_at, recipient, address, contact, total_quantity, total_price
    FROM orders 
    LEFT JOIN delivery ON orders.delivery_id = delivery.id
    WHERE user_id = ? 
  `;
  const values = [userId];

  try {
    const [rows] = await pool.execute(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleError(res, err);
  }
};

/** 주문 내역 상세 조회 */
const getOrderDetail = async (req, res) => {
  const { orderId } = camelcaseKeys(req.params);

  const sql = `
    SELECT book_id, title AS book_title, author, price, quantity
    FROM orderedbook
    LEFT JOIN books ON orderedbook.book_id = books.id
    WHERE order_id = ? 
  `;
  const values = [orderId];

  try {
    const [rows] = await pool.execute(sql, values);
    res.status(StatusCodes.OK).send({ lists: rows });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { postOrder, getOrders, getOrderDetail };
