(SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes;

SELECT EXISTS(SELECT * FROM bookstore.likes WHERE user_id = 2 AND book_id = 1) AS liked


INSERT INTO cartItems (book_id,quantity,user_id) VALUES (1,2,2)

INSERT INTO delivery (address,recipient,contact) VALUES ("서울시 중구","김인간","010-1234-5578")

const delivery_id = 

-- book_title: lists에 있는 값을 가져다가
-- delivery_id: 
INSERT INTO orders (book_title,total_quantity,total_price,payment,delivery_id,user_id) VALUES("모던 자바스크립트",1,45000,"네이버페이",delivery_id,2)

const order_id = SELECT MAX(id) FROM orders

INSERT INTO orderedbook (order_id,book_id,quantity) VALUES (order_id,1,1)

SELECT MAX(delivery_id) FROM delivery;
SELECT last_insert_id();

