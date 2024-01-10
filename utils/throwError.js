/**
 * 주어진 메시지를 사용하여 오류를 생성하고 던짐
 * 던져진 오류는 handleError()를 통해 클라이언트에게 전달됨
 */
const throwError = (message) => {
  const error = new Error(message);
  error.name = message;
  throw error;
};

module.exports = throwError;
