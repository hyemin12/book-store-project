## API 설계하기

- [회원 API](#📘회원-api)
  - [회원가입](#1-회원가입)
  - [로그인](#2-로그인)
  - [비밀번호 초기화-요청](#3-비밀번호-초기화-요청)
  - [비밀번호 초기화-수정](#4-비밀번호-초기화-수정)
- [도서 API](#📘도서-api)
  - [도서 전체 조회](#1-도서-전체-조회)
  - [도서 카테고리별 조회](#2-도서-카테고리별-조회)
  - [도서 개별 조회](#3-도서-개별-조회)
  - [도서 검색 결과](#4-도서-검색-조회)
- [장바구니 API](#📘-장바구니-api)

  - [장바구니에 추가](#1-장바구니에-추가)
  - [장바구니 조회](#2-장바구니-조회)
  - [장바구니에서 선택한 상품 목록 조회](#3-장바구니에서-선택한-상품-목록-조회)

- [주문 API](#📘-주문-api)
  - [결제하기](#1-결제하기-api)
  - [주문내역조회](#2-주문-내역-조회)
  - [주문 내역 상세 조회 (상품정보)](#3-주문-상세-조회-상품-정보-조회)
- [좋아요 API](#📘-좋아요-api)

  - [좋아요](#1-좋아요)
  - [좋아요 취소](#2-좋아요-취소)

- [ERD]()

## 📘회원 API

### 1. 회원가입

#### ■ 기본정보

| 메서드 |  URL  | status coode - Success | status coode - fail |
| :----: | :---: | :--------------------: | :-----------------: |
|  POST  | /join |          200           |         400         |

#### ■ 요청 - 바디

| 이름     | 타입   | 설명                     |
| -------- | ------ | ------------------------ |
| email    | string | 사용자가 입력한 이메일   |
| password | string | 사용자가 입력한 비밀번호 |

---

### 2. 로그인

#### ■ 기본정보

| 메서드 |  URL   | status coode - Success |     status coode - fail     |
| :----: | :----: | :--------------------: | :-------------------------: |
|  POST  | /login |          200           | 401 Unauthorized(권한 없음) |

#### ■ 요청 - 바디

| 이름     | 타입   | 설명                     |
| -------- | ------ | ------------------------ |
| email    | string | 사용자가 입력한 이메일   |
| password | string | 사용자가 입력한 비밀번호 |

---

### 3. 비밀번호 초기화 요청

#### ■ 기본정보

| 메서드 |    URL     | status coode - Success |     status coode - fail     |
| :----: | :--------: | :--------------------: | :-------------------------: |
|  POST  | /pwd-reset |          200           | 401 Unauthorized(권한 없음) |

#### ■ 요청 - 바디

| 이름  | 타입   | 설명                   |
| ----- | ------ | ---------------------- |
| email | string | 사용자가 입력한 이메일 |

---

### 4. 비밀번호 초기화 (수정)

#### ■ 기본정보

| 메서드 |    URL     | status coode - Success |     status coode - fail     |
| :----: | :--------: | :--------------------: | :-------------------------: |
|  PUT   | /pwd-reset |          200           | 401 Unauthorized(권한 없음) |

#### ■ 요청 - 바디

| 이름     | 타입   | 설명                     |
| -------- | ------ | ------------------------ |
| email    | string | 사용자가 입력한 이메일   |
| password | string | 사용자가 입력한 비밀번호 |

---

---

## 📘도서 API

### 1. 도서 전체 조회

- 수정할 내용: 8개씩 보내주기
- 이미지 추가

#### ■ 기본정보

| 메서드 |  URL   | status coode - Success | status coode - fail |
| :----: | :----: | :--------------------: | :-----------------: |
|  GET   | /books |          200           |                     |

#### ■ 응답 - 바디

| 이름  | 타입                         | 설명           |
| ----- | ---------------------------- | -------------- |
| lists | [Book[ ]](#※-book-item-type) | 전체 도서 목록 |

#### ■ 응답 예시

```json
[
  {
    "id": "snow1",
    "category": "소설",
    "title": "크리스마스에 눈이 올까요",
    "summary": "도서를 요약한 내용",
    "author": "김작가",
    "published_at": "2023-12-25",
    "price": 15000,
    "likes": 50,
    "liked": true
  }
  // ...
]
```

### 2. 도서 카테고리별 조회

- `new= true`: 신간 조회 (출간일 30일 이내)

#### ■ 기본정보

| 메서드 |               URL                | status coode - Success | status coode - fail |
| :----: | :------------------------------: | :--------------------: | :-----------------: |
|  GET   | /books/:categoryId&new={boolean} |          200           |                     |

#### ■ 요청 - 쿼리 파라미터

| 이름 | 타입    | 설명           | 필수 |
| ---- | ------- | -------------- | ---- |
| new  | boolean | 신간 조회 여부 | X    |

#### ■ 응답 - 바디

| 이름  | 타입                         | 설명           |
| ----- | ---------------------------- | -------------- |
| lists | [Book[ ]](#※-book-item-type) | 전체 도서 목록 |

#### ■ 응답 예시

```json
[
  {
    "id": 1,
    "category": "소설",
    "title": "크리스마스에 눈이 올까요",
    "summary": "도서를 요약한 내용",
    "author": "김작가",
    "published_at": "2023-12-25",
    "price": 15000,
    "likes": 50,
    "liked": true
  }
  // ...
]
```

### 3. 도서 개별 조회

#### ■ 기본정보

| 메서드 |      URL       | status coode - Success | status coode - fail |
| :----: | :------------: | :--------------------: | :-----------------: |
|  GET   | /books/:bookId |          200           |                     |

#### ■ 응답 - 바디

| 이름         | 타입    | 설명             |
| ------------ | ------- | ---------------- |
| id           | int     | 도서 아이디      |
| isbn         | int     | isbn (도서 번호) |
| category     | string  | 도서 카테고리    |
| index        | string  | 목차             |
| title        | string  | 도서 제목        |
| summary      | string  | 도서 요약 (설명) |
| description  | string  | 상세설명         |
| author       | string  | 작가             |
| pages        | int     | 총 페이지        |
| published_at | string  | 출간일           |
| price        | int     | 가격             |
| likes        | int     | 좋아요 수        |
| liked        | boolean | 좋아요 클릭 여부 |

#### ■ 응답 예시

```json
{
  "id": 1,
  "isbn": 1230123412340,
  "category": "소설",
  "index": "목차",
  "title": "크리스마스에 눈이 올까요",
  "summary": "도서를 요약한 내용",
  "description": "올 크리스마스에는 눈이 올까요?",
  "author": "김작가",
  "pages": 254,
  "published_at": "2023-12-25",
  "price": 15000,
  "likes": 50,
  "liked": true
}
```

### 4. 도서 검색 조회

검색어를 query로 받아서 조회

#### ■ 기본정보

| 메서드 |             URL              | status coode - Success | status coode - fail |
| :----: | :--------------------------: | :--------------------: | :-----------------: |
|  GET   | /books/search?query={string} |          200           |                     |

#### ■ 요청 - 쿼리 파라미터

| 이름  | 타입   | 설명               | 필수 |
| ----- | ------ | ------------------ | ---- |
| query | string | 검색을 원하는 단어 | O    |

#### ■ 응답 - 바디

| 이름  | 타입             | 설명             |
| ----- | ---------------- | ---------------- |
| lists | [Book[ ]](#book) | 검색 결과 리스트 |

#### Book

| 이름         | 타입    | 설명             |
| ------------ | ------- | ---------------- |
| id           | int     | 도서 아이디      |
| category     | string  | 도서 카테고리    |
| title        | string  | 도서 제목        |
| summary      | string  | 도서 요약 (설명) |
| author       | string  | 작가             |
| published_at | string  | 출간일           |
| price        | int     | 가격             |
| likes        | int     | 좋아요 수        |
| liked        | boolean | 좋아요 클릭 여부 |

```json
[
  {
    "id": 1,
    "isbn": 1230123412340,
    "category": "소설",
    "index": "목차",
    "title": "크리스마스에 눈이 올까요",
    "summary": "도서를 요약한 내용",
    "description": "올 크리스마스에는 눈이 올까요?",
    "author": "김작가",
    "pages": 254,
    "published_at": "2023-12-25",
    "price": 15000,
    "likes": 50,
    "liked": true
  }
]
```

---

---

## 📘 장바구니 API

### 1. 장바구니에 추가

#### ■ 기본정보

| 메서드 |  URL  | status coode - Success | status coode - fail |
| :----: | :---: | :--------------------: | :-----------------: |
|  POST  | /cart |          201           |                     |

#### ■ 요청 - 바디

| 이름     | 타입 | 설명        |
| -------- | ---- | ----------- |
| book_id  | int  | 도서 아이디 |
| quantity | int  | 수량        |

#### ■ 응답 - 바디

| 이름  | 타입             | 설명             |
| ----- | ---------------- | ---------------- |
| lists | [Book[ ]](#book) | 검색 결과 리스트 |

### 2. 장바구니 조회

#### ■ 기본정보

| 메서드 |  URL  | status coode - Success | status coode - fail |
| :----: | :---: | :--------------------: | :-----------------: |
|  GET   | /cart |          200           |                     |

#### ■ 응답 - 바디

| 이름  | 타입    | 설명                      |
| ----- | ------- | ------------------------- |
| lists | Cart[ ] | 카트에 담겨있는 도서 목록 |

#### Cart

| 이름     | 타입   | 설명                   |
| -------- | ------ | ---------------------- |
| cart_id  | int    | 장바구니 아이템의 id값 |
| book_id  | string | 도서 아이디            |
| title    | string | 도서제목               |
| price    | int    | 가격                   |
| quantity | int    | 수량                   |

#### ■ 응답 예시

```json
[
  {
    "cartItem_id": 1,
    "book_id": 1,
    "title": "크리스마스에 눈이 올까요",
    "price": 15000,
    "quantity": 2
  }
  // ...
]
```

### 3. 장바구니에서 선택한 상품 목록 조회

#### ■ 기본정보

| 메서드 |  URL   | status coode - Success | status coode - fail |
| :----: | :----: | :--------------------: | :-----------------: |
|  GET   | /order |          200           |                     |

#### ■ 요청 - 바디

| 이름  | 타입         | 설명                      |
| ----- | ------------ | ------------------------- |
| lists | CartItems[ ] | 카트에 담겨있는 도서 목록 |

#### CartItems

| 이름       | 타입 | 설명                   |
| ---------- | ---- | ---------------------- |
| cartItemId | int  | 장바구니 아이템의 id값 |

#### ■ 응답 - 바디

| 이름  | 타입    | 설명                      |
| ----- | ------- | ------------------------- |
| lists | Cart[ ] | 카트에 담겨있는 도서 목록 |

#### ■ 응답 예시

```json
[
  {
    "cartItem_id": 1,
    "book_id": 1,
    "title": "크리스마스에 눈이 올까요",
    "price": 15000,
    "quantity": 2
  }
  // ...
]
```

---

---

## 📘 주문 API

- 결제한 내용이 데이터베이스에 INSERT
- 주문이 성공한다면 장바구니 내역은 데이터베이스에서 DELETE

### 1. 결제하기 API

#### ■ 기본정보

| 메서드 |   URL   | status coode - Success | status coode - fail |
| :----: | :-----: | :--------------------: | :-----------------: |
|  POST  | /orders |          200           |                     |

#### ■ 요청 - 바디

| 이름       | 타입                       | 설명                         |
| ---------- | -------------------------- | ---------------------------- |
| lists      | [BookItems[ ]](#bookitems) | 상품 목록 (주문한 책 아이디) |
| delivery   | [Delivery](#delivery)      | 배송 정보                    |
| payment    | varchar                    | 결제 정보                    |
| totalPrice | int                        | 총 금액                      |

#### bookItems

| 이름     | 타입 | 설명               |
| -------- | ---- | ------------------ |
| book_id  | int  | 주문한 도서 아이디 |
| quantity | int  | 주문한 도서 수량   |
| cart_id  | int  | 장바구니 아이디    |

#### Delivery

| 이름      | 타입    | 설명             |
| --------- | ------- | ---------------- |
| recipient | varchar | 받는 사람 이름   |
| address   | varchar | 받는 사람 주소   |
| contact   | varchar | 받는 사람 연락처 |

### 2. 주문 내역 조회

#### ■ 기본정보

| 메서드 |   URL   | status coode - Success | status coode - fail |
| :----: | :-----: | :--------------------: | :-----------------: |
|  POST  | /orders |          200           |                     |

#### ■ 응답 - 바디

| 이름           | 타입                  | 설명            |
| -------------- | --------------------- | --------------- |
| order_id       | int                   | 주문 아이디     |
| created_at     | timestamp             | 주문 일자       |
| delivery       | [Delivery](#delivery) | 배송 정보       |
| book_title     | varchar               | 도서 제목 (1개) |
| total_price    | int                   | 총 금액         |
| total_quantity | int                   | 총 수량         |

### 3. 주문 상세 조회 (상품 정보 조회)

- orderedBook 테이블 조회
- orderedBook 테이블의 book_id로 books 테이블과 조인해서 도서 정보 가져오기

#### ■ 기본정보

| 메서드 |       URL        | status coode - Success | status coode - fail |
| :----: | :--------------: | :--------------------: | :-----------------: |
|  GET   | /orders/:orderId |          200           |                     |

#### ■ 응답 - 바디

| 이름  | 타입    | 설명      |
| ----- | ------- | --------- |
| lists | Books[] | 도서 정보 |

#### Books

| 이름       | 타입 | 설명        |
| ---------- | ---- | ----------- |
| book_id    | int  | 도서 아이디 |
| book_title | int  | 도서 제목   |
| author     | int  | 작가        |
| price      | int  | 가격        |
| quantity   | int  | 주문 수량   |

---

---

## 📘 좋아요 API

### 1. 좋아요

#### ■ 기본정보

| 메서드 |       URL        | status coode - Success | status coode - fail |
| :----: | :--------------: | :--------------------: | :-----------------: |
|  POST  | /likes/:{bookId} |          200           |                     |

#### ■ 요청

| 이름   | 타입 | 설명        |
| ------ | ---- | ----------- |
| bookId | int  | 도서 아이디 |

#### ■ 응답 - 바디

| 이름  | 타입                          | 설명                      |
| ----- | ----------------------------- | ------------------------- |
| lists | [Books[ ]](#※-book-item-type) | 카트에 담겨있는 도서 목록 |

### 2. 좋아요 취소

| 메서드 |       URL        | status coode - Success | status coode - fail |
| :----: | :--------------: | :--------------------: | :-----------------: |
| DELETE | /likes/:{bookId} |          200           |                     |

#### ■ 요청

| 이름   | 타입 | 설명        |
| ------ | ---- | ----------- |
| bookId | int  | 도서 아이디 |

#### ■ Books

| 이름         | 타입    | 설명             |
| ------------ | ------- | ---------------- |
| id           | int     | 도서 아이디      |
| isbn         | int     | isbn (도서 번호) |
| category     | string  | 도서 카테고리    |
| index        | string  | 목차             |
| title        | string  | 도서 제목        |
| summary      | string  | 도서 요약 (설명) |
| description  | string  | 상세설명         |
| author       | string  | 작가             |
| pages        | int     | 총 페이지        |
| published_at | string  | 출간일           |
| price        | int     | 가격             |
| likes        | int     | 좋아요 수        |
| liked        | boolean | 좋아요 클릭 여부 |

```json
{
  "id": "snow1",
  "isbn": 1230123412340,
  "category": "소설",
  "index": "목차",
  "title": "크리스마스에 눈이 올까요",
  "summary": "도서를 요약한 내용",
  "description": "올 크리스마스에는 눈이 올까요?",
  "author": "김작가",
  "pages": 254,
  "published_at": "2023-12-25",
  "price": 15000,
  "likes": 50,
  "liked": true
}
```

## ERD
