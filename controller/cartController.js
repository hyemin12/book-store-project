const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const pool = require('../mysql');

const { handleError, throwError } = require('../utils/handleError');
const {
  checkCartItemExistence,
  findCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItems
} = require('../model/carts');
const { findBook } = require('../model/books');

/** 장바구니에 아이템 추가 */
const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = camelcaseKeys(req.body);
    const userId = req.user?.id;

    // Step 1: 도서가 DB에 존재하는지 확인
    const book = await findBook({ bookId });
    if (!book) {
      throwError('DB에 존재하지 않는 값');
    }

    // Step 2: 장바구니에 이미 담겨있는 아이템인지 확인
    const { isExist, cartItemId, dbQuantity } = await checkCartItemExistence();
    if (isExist) {
      const result = await updateCartItem({ id: cartItemId, quantity: dbQuantity + 1 });
      if (!result) {
        throwError('장바구니 수량 변경 오류');
      }
      return res.status(StatusCodes.OK).send({
        message: `이미 존재하는 아이템!  수량 추가. 
          변경된 수량: ${addQuantity}`
      });
    }

    // Step 3: 장바구니에 담기
    const result = await createCartItem({ quantity, bookId, userId });
    if (!result) {
      throwError('장바구니 아이템 담기 오류');
    }

    res.status(StatusCodes.OK).send({ message: '장바구니에 추가완료 ' });
  } catch (err) {
    handleError(res, err);
  }
};

/** 장바구니의 아이템 조회
 * @body selected 선택된 아이템의 목록
 */
const getCartsItems = async (req, res) => {
  try {
    const { selected } = req.body;
    const userId = req.user?.id;

    const lists = await findCartItems({ userId, selected });
    res.status(StatusCodes.OK).send({ lists });
  } catch (err) {
    handleError(res, err);
  }
};

/** 장바구니의 아이템 삭제 */
const deleteCartsItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCartItems({ id });
    if (!result) {
      throwError('장바구니 아이템 삭제 오류');
    }
  } catch (err) {
    handleError(res, err);
  }
};

/** 장바구니의 아이템 수량 변경 */
const updateCartItemCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await updateCartItem({ id, quantity });
    if (!result) {
      throwError('장바구니 아이템 수량 변경 오류');
    }

    res.status(StatusCodes.OK).send({ message: '수량 변경 성공' });
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
