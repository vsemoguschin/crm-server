module.exports = function checkPassword(value) {
  return new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).test(value);
};
