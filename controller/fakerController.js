const { faker } = require('@faker-js/faker');
const { StatusCodes } = require('http-status-codes');

const createRandomIsbn = (req, res) => {
  const { count } = req.query;
  const createIsbn = () => ({ isbn: faker.commerce.isbn() });

  const isbns = createMultiple(createIsbn, count);

  res.status(StatusCodes.OK).send({ isbns });
};

const createRandomUser = (req, res) => {
  const { count } = req.query;
  const createUser = () => ({
    email: faker.internet.email(),
    password: faker.internet.password()
  });

  const users = createMultiple(createUser, count);

  res.status(StatusCodes.OK).send({ users });
};

const createMultiple = (callback, count) => {
  const parseIntCount = parseInt(count);
  return faker.helpers.multiple(callback, { count: parseIntCount ? parseIntCount : 1 });
};

module.exports = { createRandomIsbn, createRandomUser };
