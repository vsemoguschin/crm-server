const ApiError = require('../../error/apiError');
const dealsPermissions = require('./dealsPermissions');
const uuid = require('uuid');
const checkFormat = require('../../checking/checkFormat');

class DealsRouterMiddleware {
  create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    const requester = req.user.role;
    const requesterID = req.user.id;
    const { title, price, deadline, clientId, sellDate, description } = req.body;
    const { img, draft } = req.files;
    try {
      const permission = dealsPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden('Нет доступа');
      }

      if (!title || !price || !deadline || !sellDate || (req?.files && !req?.files?.img) || !req?.files?.draft) {
        throw ApiError.BadRequest('Забыл что то указать');
      }
      if (price && isNaN(price)) {
        throw ApiError.BadRequest('Не верное price');
      }
      const imgFormat = checkFormat(img.name);
      if (!imgFormat) {
        throw ApiError.BadRequest('Не верный формат изображения');
      }
      const draftFormat = checkFormat(draft.name, ['dws', 'dxf', 'dwg']);
      if (!draftFormat) {
        throw ApiError.BadRequest('Не верный формат макета');
      }

      let preview = uuid.v4() + imgFormat;
      let draftName = uuid.v4() + draftFormat;
      req.new_deal = {
        title,
        price,
        clientId,
        sellDate,
        deadline,
        status: 'created',
        description,
        preview,
        draft: draftName,
        clothing_method: 'ping',
        userId: req.user.id,
      };
      next();
    } catch (e) {
      next(e);
    }
  }
  getOne(req, res, next) {
    const requester = req.user.role;
    console.log(req.params);
    try {
      const permission = dealsPermissions.check(requester);
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
      const { userId, clientId } = req.query;
      const requester = req.user.role;
      const permission = dealsPermissions.check(requester);
      if (!permission) {
        throw ApiError.Forbidden('Нет доступа');
      }
      if (userId && isNaN(userId)) {
        throw ApiError.BadRequest('Не верное userId');
      }
      if (clientId && isNaN(clientId)) {
        throw ApiError.BadRequest('Не верное clientId');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsRouterMiddleware();
