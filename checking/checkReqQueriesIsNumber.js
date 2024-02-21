const ApiError = require('../error/apiError');

module.exports = function (queries) {
  const result = {};
  for (const key in queries) {
    if (queries[key] !== undefined) {
      result[key] = +queries[key];
    }
  }
  for (const key in result) {
    if (isNaN(+queries[key])) {
      throw ApiError.BadRequest('wrong query', key);
    }
  }
  return result;
};
