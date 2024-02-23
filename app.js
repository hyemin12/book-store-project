const errorHandler = require('./middleware/errorHandler');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is open! port number is ${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
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

// error hanlder
app.use(errorHandler);
