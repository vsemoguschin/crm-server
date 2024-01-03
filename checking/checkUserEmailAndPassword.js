const checkEmail = require("./checkEmail");
const checkPassword = require("./checkPassword");

module.exports = function checkEmailAndPassword(email, password) {
  const data = {
    message: "Ошибка создания пользователя. Обратитесь к администратору",
    fields: [],
  };
  if (email && !checkEmail(email)) {
    data.fields.push("email");
  }
  if (password && !checkPassword(password)) {
    data.fields.push("password");
  }
  return data.fields.length > 0 ? data : undefined;
};
