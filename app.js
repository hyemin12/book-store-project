const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is open! port number is ${PORT}`);
});

const userRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const cartsRouter = require('./routes/carts');
const ordersRouter = require('./routes/orders');
const likesRouter = require('./routes/likes');
const fakerRouter = require('./routes/faker');

app.use('/users', userRouter);
app.use('/books', booksRouter);
app.use('/category', categoryRouter);
app.use('/carts', cartsRouter);
app.use('/orders', ordersRouter);
app.use('/likes', likesRouter);
app.use('/faker', fakerRouter);
