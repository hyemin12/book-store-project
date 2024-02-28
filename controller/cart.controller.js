const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const asyncHandler = require('express-async-handler');

const { DatabaseError, NotFoundError } = require('../utils/errors');
const {
  checkCartItemExistence,
  findCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItems
} = require('../model/carts.model');
const { findBook } = require('../model/books.model');

/** 장바구니에 아이템 추가 */
const addToCart = asyncHandler(async (req, res) => {
  const { bookId, quantity } = camelcaseKeys(req.body);
  const numberBookId = Number(bookId);
  const numberQuantity = Number(quantity);
  const userId = req.user?.id;

  // Step 1: 도서가 DB에 존재하는지 확인
  const book = await findBook({ bookId: numberBookId });
  if (!book) {
    throw new NotFoundError();
  }

  // Step 2: 장바구니에 이미 담겨있는 아이템인지 확인
  const { isExist, cartItemId, cartItemDBQuantity } = await checkCartItemExistence({ userId, bookId: numberBookId });
  if (isExist) {
    const result = await updateCartItem({ id: cartItemId, quantity: cartItemDBQuantity + 1 });
    if (!result) {
      throw new DatabaseError();
    }

    return res.status(StatusCodes.OK).send({
      message: `이미 존재하는 아이템!  수량 추가. 
          변경된 수량: ${cartItemDBQuantity + 1}`
    });
  }

  // Step 3: 장바구니에 담기
  const { cartId } = await createCartItem({ quantity: numberQuantity, bookId: numberBookId, userId });
  if (!cartId) {
    throw new DatabaseError();
  }

  res.status(StatusCodes.OK).send({ id: cartId, message: '장바구니에 추가완료 ' });
});

/** 장바구니의 아이템 조회
 * @body selected 선택된 아이템의 목록
 */
const getCartsItems = asyncHandler(async (req, res) => {
  const { selected } = req.body;
  const userId = req.user?.id;
  const lists = await findCartItems({ userId, selected });
  res.status(StatusCodes.OK).send({ lists });
});

/** 장바구니의 아이템 삭제 */
const deleteCartsItem = asyncHandler(async (req, res) => {
  const { id, idArr } = req.params;

  const result = await deleteCartItems({ id, idArr });
  if (!result) {
    throw new DatabaseError();
  }
});

/** 장바구니의 아이템 수량 변경 */
const updateCartItemCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const result = await updateCartItem({ id, quantity });
  if (!result) {
    throw new DatabaseError();
  }

  res.status(StatusCodes.OK).send({ message: '수량 변경 성공' });
});

module.exports = {
  addToCart,
  deleteCartsItem,
  getCartsItems,
  updateCartItemCount
};
