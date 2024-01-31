const pool = require('../mysql');
const checkDataExistence = require('../utils/checkDataExistence');

const checkEmailExistence = async ({ email }) => {
  const checkEmailExistenceQuery = 'SELECT * FROM users WHERE email = ?';

  const { isExist } = await checkDataExistence(checkEmailExistenceQuery, [email]);

  return isExist;
};

const createUser = async ({ email, password }) => {
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  const values = [email, password];

  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows > 0;
};

const findUser = async ({ email }) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const values = [email];

  const [[user]] = await pool.execute(sql, values);
  return user;
};

const updateUserPassword = async ({ email, password }) => {
  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  const values = [password, email];

  const [rows] = await pool.execute(sql, values);
  return rows.affectedRows > 0;
};

module.exports = {
  checkEmailExistence,
  createUser,
  findUser,
  updateUserPassword
};
