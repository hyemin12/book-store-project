const express = require("express");
const app = express();
const PORT = 8888;

app.listen(PORT, () => {
  console.log(`server is open! port number is ${PORT}`);
});

const userRouter = require("./routes/users");

app.use("/", userRouter);
