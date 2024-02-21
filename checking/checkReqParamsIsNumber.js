const ApiError = require('../error/apiError');

module.exports = function (req, res, next) {
  try {
    const { params } = req;
    for (const key in params) {
      if (isNaN(+params[key])) {
        throw ApiError.Forbidden('wrong path');
      }
      req.params[key] = +params[key];
    }
    next();
  } catch (e) {
    next(e);
  }
};
