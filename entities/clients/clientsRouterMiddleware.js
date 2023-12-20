const ApiError = require("../../error/apiError");
const Client = require("./clientsModel");
const clientPermissions = require("./clientsPermissions");

class ClientsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    const requester = req.user.role;
    const { fullName, phone } = req.body;
    try {
      const permission = clientPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden("Нет доступа");
      }

      if (!phone || !fullName) {
        return next(ApiError.BadRequest("Забыл что то указать"));
      }
      if ((phone && isNaN(phone)) || phone.length != 12) {
        return next(ApiError.BadRequest("Ошибка создания клиента"));
        return res.status(400).json({
          message: "Ошибка создания клиента",
          fields: ["phone"],
        });
      }
      // повторку не создавать
      const condidate = await Client.findOne({ where: { phone } });
      console.log({ condidate });
      if (condidate) { // почему не вернуть данные клиента?
        return res.status(400).json({
          message: "Пользователь с таким телефоном уже существует",
          fields: ["phone"],
        });
      }

      req.new_client = { fullName, phone, userId: req.user.id };
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  getOne(req, res, next) {
    const requester = req.user.role;
    try {
      const permission = clientPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden("Нет доступа");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  getList(req, res, next) {
    const requester = req.user.role;
    const { phone, owner } = req.query;
    try {
      const permission = clientPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden("Нет доступа");
      }
      if (owner && isNaN(owner)) {
        throw ApiError.BadRequest("Не верное userId");
      }
      // if (phone && isNaN(phone) && phone.length != 11) {
      //     throw ApiError.BadRequest("Не верное phone")
      // };
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ClientsRouterMiddleware();
