const ApiError = require("../../error/apiError");
const paymentsPermissions = require("./paymentsPermissions");
const availablePaymentType = ["link", "cash", "contract", "transfer"];

class PaymentsRouterMiddleware {
  create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    const requester = req.user.role;
    const requesterID = req.user.id;
    const { name, price, method, date, description, dealId } = req.body;
    try {
      if (!name || !price || !method || !date || !description || !dealId) {
        throw ApiError.BadRequest("Забыл что то указать");
      }
      if (
        !availablePaymentType.some((paymentsType) => paymentsType == method)
      ) {
        throw ApiError.BadRequest("Не верное payment");
      }
      if (price && isNaN(price)) {
        throw ApiError.BadRequest("Не верное price");
      }
      const permission = paymentsPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden("Нет доступа");
      }
      req.new_payment = {
        name,
        price,
        method,
        date,
        description,
        dealId,
        userId: requesterID,
      };
      next();
    } catch (e) {
      next(e);
    }
  }
  getOne(req, res, next) {
    const requester = req.user.role;
    try {
      const permission = paymentsPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden("Нет доступа");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  getList(req, res, next) {
    try {
      const { userId, dealId, type } = req.query;
      const requester = req.user.role;
      const permission = paymentsPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden("Нет доступа");
      }
      if (availablePaymentType.some((paymentsType) => paymentsType !== type)) {
        throw ApiError.BadRequest("Не верное payment");
      }
      if (userId && isNaN(userId)) {
        throw ApiError.BadRequest("Не верное userId");
      }
      if (dealId && isNaN(dealId)) {
        throw ApiError.BadRequest("Не верное dealId");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PaymentsRouterMiddleware();
