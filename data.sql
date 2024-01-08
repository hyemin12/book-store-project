(SELECT count(*) FROM bookstore.likes WHERE book_id = books.id) AS likes;

SELECT EXISTS(SELECT * FROM bookstore.likes WHERE user_id = 2 AND book_id = 1) AS liked


INSERT INTO cartItems (book_id,quantity,user_id) VALUES (1,2,2)