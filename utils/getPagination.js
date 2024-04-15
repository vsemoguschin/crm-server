module.exports = function getPagination(page = 1, size = 10) {
  const limit = +size;
  const offset = page * limit - limit;

  return { limit, offset };
};
