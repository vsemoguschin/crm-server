const ApiError = require("../../error/apiError");
const { Client, modelFields: clientsModelFields } = require("./clientsModel");
const modelsService = require('../../services/modelsService');

const frontOptions = {
  modelFields: modelsService.getModelFields(clientsModelFields),
};
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['gender', 'city', 'region', 'type', 'sphere', 'fullName', 'chatLink', 'phone', 'info'];
const searchFields = ['gender', 'city', 'region', 'type', 'sphere', 'fullName', 'chatLink', 'phone'];


class ClientsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      // сделать валидацию номера телефона
      req.newClient = await modelsService.checkFields(clientsModelFields, req.body);
      next();
    } catch (e) {
      console.log(e);
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
      console.log(req.user);
      if (requester !== 'ADMIN' && req.params.id < 3) {
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
      if (requester !== 'ADMIN' && req.params.id < 3) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updateFields = updateFields;
      next()
    } catch (e) {
      next(e)
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (requester !== 'ADMIN' && req.params.id < 3) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new ClientsRouterMiddleware();
