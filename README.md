# Book store 프로젝트

### 📘 사용 기술

- nodejs
- mysql2
- express
- bcrypt
- jsonwebtoken

### 📘API

- [API 문서 링크](https://documenter.getpostman.com/view/20294136/2s9YsKeqt3)

### 📘실행 방법

1. 프로젝트를 클론

```bash
git clone https://github.com/hyemin12/book-store-project.git
cd book-store
```

2. 필요한 패키지 설치

```bash
npm install
```

3. 프로젝트 실행

```bash
npm start
```

또는

```bash
nodemon app.js
```

### 📘 서비스 소개

1. User 서비스

- 로그인
- 회원가입
- 비밀번호 변경

2. Books 서비스

- 전체 도서 조회 (전체/ 카테고리별/ 신간)
- 개별 도서 조회
- 도서 검색 결과 조회

3. Category 서비스

- 전체 카테고리 조회

1. Orders 서비스

- 주문하기
- 주문 내역 조회

5. Likes 서비스

- 도서 좋아요 누르기
- 도서 좋아요 취소하기

6. Carts 서비스

- 장바구니에 담기
- 장바구니 조회 (전체/ 선택한 도서만)
- 장바구니에서 도서 삭제
- 도서 수량 변경
