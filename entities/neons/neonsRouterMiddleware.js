const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: neonsModelFields } = require('./neonsModel');
const { Order } = require('../association');

const frontOptions = {
  modelFields: modelsService.getModelFields(neonsModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['width', 'length', 'color', 'type'];
const searchFields = ['width', 'color', 'type'];

class NeonsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка значения и наличия заказа
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const order = await Order.findOne({
        where: { id: req.params.id },
      });
      if (!order) {
        console.log(false, 'No order');
        throw ApiError.BadRequest('No order');
      }
      const newNeon = await modelsService.checkFields(neonsModelFields, req.body);
      req.newNeon = newNeon;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.searchFields = searchFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updateFields = updateFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new NeonsRouterMiddleware();
