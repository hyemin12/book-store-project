const { StatusCodes } = require('http-status-codes');
const camelcaseKeys = require('camelcase-keys');
const asyncHandler = require('express-async-handler');

const { findBooks, findBook, findReviews, findBestSeller, findQuery } = require('../model/books');
const { handleError } = require('../utils/handleError');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 6;

/** 도서 조회
 * @param category_id: 카테고리별로 조회할 때 사용
 * @param new: 신간을 조회할 때 사용
 * @param page: 페이지 (입력하지 않으면 기본값으로 1 설정)
 * @param limit: 전달받을 개수 (입력하지 않으면 기본값으로 8 설정)
 */
const getBooks = asyncHandler(async (req, res) => {
  const { categoryId, new: fetchNewBooks, page, limit } = camelcaseKeys(req.query);
  const userId = req.user?.id;

  const { computedLimit, computedPage, offset } = calcPagination(page, limit);

  const { books, totalCount } = await findBooks({ userId, limit: computedLimit, offset, fetchNewBooks, categoryId });

  const result = {
    lists: books,
    pagenation: {
      current_page: computedPage,
      total_count: totalCount
    }
  };
  res.status(StatusCodes.OK).send(result);
});

/** 개별 도서 조회
 * @return {도서 정보 상세 내역, reviews: 도서 리뷰 목록, bestSeller: 베스트 목록}
 */
const getIndividualBook = asyncHandler(async (req, res) => {
  const { bookId } = camelcaseKeys(req.params);
  const userId = req.user?.id;

  const book = await findBook({ bookId, userId });
  const categoryId = book.category_id;

  const reviews = await findReviews({ bookId });

  const bestSellers = await findBestSeller({ categoryId, bookId });

  const result = { ...book, reviews, bestSellers };
  res.status(StatusCodes.OK).send(result);
});

/** 도서 검색
 * @returns {list: 도서목록, pagenation: {current_page:현재페이지, total_count: 전체 아이템 수}}
 */
const getSearchBooks = asyncHandler(async (req, res) => {
  const { page, limit, query } = req.query;

  const { computedLimit, computedPage, offset } = calcPagination(page, limit);

  const { books, totalCount } = await findQuery({ query, limit: computedLimit, offset });

  const result = {
    lists: books,
    pagenation: {
      current_page: computedPage,
      total_count: totalCount
    }
  };
  res.status(StatusCodes.OK).send(result);
});

/** 페이지네이션 계산 함수*/
const calcPagination = (page, limit) => {
  const computedPage = page || DEFAULT_PAGE;
  const computedLimit = limit || DEFAULT_LIMIT;
  const offset = computedLimit * (computedPage - 1);

  return { computedLimit, computedPage, offset };
};

module.exports = {
  getBooks,
  getSearchBooks,
  getIndividualBook
};
