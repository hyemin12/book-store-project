const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const asyncHandler = require('express-async-handler');
const pool = require('../mysql');

const { handleError, throwError } = require('../utils/handleError');
const {
  checkDeliveryExistence,
  createDelivery,
  createOrder,
  createOrderDetails,
  findOrderList,
  findOrderDetails
} = require('../model/orders');
const { deleteCartItems } = require('../model/carts');

/* 주문 프로세스
 * 1. 클라이언트에서 전달받은 delivery 데이터가 delivery 테이블에 존재하는지 확인
 *    - 존재한다면 데이터베이스에 찾은 값을 delivery_id에 할당
 *    - 존재하지 않는다면 delivery 테이블에 데이터를 추가하고, 추가된 delivery_id를 할당
 * 2. orders 테이블에 주문 내역 추가하기
 * 3. orderbook 테이블에 주문한 도서 목록 데이터 추가하기
 * 4. 장바구니 목록에서 주문한 도서 목록 삭제하기
 */
/** 주문하기 (결제 하기) */
const postOrder = async (req, res, next) => {
  try {
    const { books, delivery, payment, totalPrice, totalQuantity, firstBookTitle } = camelcaseKeys(req.body);
    const userId = req.user?.id;

    const conn = await pool.getConnection();

    await conn.beginTransaction();

    // Step 1: Delivery 정보 확인 및 추가
    let deliveryId;
    const { isExist, dbDeliveryId } = await checkDeliveryExistence({ ...delivery, conn });
    if (isExist) {
      deliveryId = dbDeliveryId;
    } else {
      const { result, dbDeliveryId } = await createDelivery({ ...delivery });
      if (!result) {
        throwError('배송정보 추가 실패');
      }
      deliveryId = dbDeliveryId;
    }

    // Step 2: Orders 테이블에 주문 내역 추가
    const { result: step2Result, orderId } = await createOrder({
      bookTitle: firstBookTitle,
      totalQuantity,
      totalPrice,
      payment,
      deliveryId,
      userId,
      conn
    });
    if (!step2Result || !orderId) {
      throwError('주문 내역 추가 실패');
    }

    const valuesOrderedBook = [];
    const valuesDeleteCart = [];
    books.forEach((item) => {
      valuesOrderedBook.push(orderId, item.book_id, item.quantity);
      valuesDeleteCart.push(item.cartItem_id);
    });

    // Step 3: OrderedBook 테이블에 주문한 도서 목록 추가
    const loopCount = books.length - 1;
    const step3Result = await createOrderDetails({ count: loopCount, values: valuesOrderedBook, conn });
    if (!step3Result) {
      throwError('주문 아이템 목록 추가 실패');
    }

    // Step 4: 장바구니 목록에서 주문한 도서 목록 삭제
    const step4Result = await deleteCartItems({ idArr: valuesDeleteCart, count: loopCount, conn });
    if (!step4Result) {
      throwError('장바구니 아이템 삭제 오류');
    }
    await conn.commit();
    res.status(StatusCodes.OK).send({ message: '결제 성공 및 장바구니 아이템 삭제' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
};

/** 주문 내역 조회 */
const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const lists = await findOrderList({ userId });

  res.status(StatusCodes.OK).send({ lists });
});

/** 주문 내역 상세 조회 */
const getOrderDetail = asyncHandler(async (req, res) => {
  const { orderId } = camelcaseKeys(req.params);

  const lists = await findOrderDetails({ orderId });
  res.status(StatusCodes.OK).send({ lists });
});

module.exports = { postOrder, getOrders, getOrderDetail };
