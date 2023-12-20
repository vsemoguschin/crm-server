module.exports = function checkPassword(value) {
  return new RegExp(
    /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
  ).test(value);
};
