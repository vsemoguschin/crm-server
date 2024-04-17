module.exports = function getPagination(page = 1, pageSize = 10) {
  const limit = +pageSize;
  const offset = page * limit - limit;

  return { limit, offset };
};
