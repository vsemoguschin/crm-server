const ApiError = require('../../error/apiError');
const filesPermissions = require('./filesPermissions');

class FilesRouterMiddleware {
  create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    const requester = req.user.role;
    const requesterID = req.user.id;
    const { name, size } = req.body;
    const availableDopsType = ['present', 'plenka', '...'];
    try {
      if (!name) {
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const permission = filesPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden('Нет доступа');
      }
      req.new_dop = {
        name,
        size,
      };
      next();
    } catch (e) {
      next(e);
    }
  }
  getOne(req, res, next) {
    const requester = req.user.role;
    try {
      const permission = filesPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  getList(req, res, next) {
    try {
      const { userId, dealId, method } = req.query;
      const requester = req.user.role;
      const permission = filesPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden('Нет доступа');
      }
      if (userId && isNaN(userId)) {
        throw ApiError.BadRequest('Не верное userId');
      }
      if (dealId && isNaN(dealId)) {
        throw ApiError.BadRequest('Не верное dealId');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FilesRouterMiddleware();
