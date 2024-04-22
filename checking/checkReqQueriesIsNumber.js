const ApiError = require('../error/apiError');

module.exports = function (queries, fields) {
  let result = {};
  for (const key in queries) {
    if (queries[key] !== undefined) {
      result[key] = +queries[key];
    }
  }
  if (fields) {
    result = {};
    for (const key in queries) {
      if (fields.includes(key)) {
        result[key] = +queries[key];
      }
    }
  }
  for (const key in result) {
    if (isNaN(+queries[key]) || +queries[key] < 0) {
      throw ApiError.BadRequest('wrong query or negative', key);
    }
  }
  return result;
};
