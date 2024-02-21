const ApiError = require('../../error/apiError');
const { modelFields: clientsModelFields, Client } = require('./clientsModel');
const modelsService = require('../../services/modelsService');
const { WorkSpace } = require('../association');
const checkPermissions = require('./clientsPermissions');

const frontOptions = {
  modelFields: modelsService.getModelFields(clientsModelFields),
};

const updateFields = ['gender', 'city', 'region', 'type', 'sphere', 'fullName', 'chatLink', 'phone', 'info'];
const searchFields = ['gender', 'city', 'region', 'type', 'sphere', 'fullName', 'chatLink', 'phone'];

class ClientsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      checkPermissions(requester);
      const workSpace = await WorkSpace.findOne({
        where: {
          id: req.params.id,
          department: 'COMMERCIAL',
        },
      });
      if (!workSpace) {
        console.log(false, 'No workSpace');
        throw ApiError.BadRequest('No workSpace');
      }
      // сделать валидацию номера телефона
      req.newClient = await modelsService.checkFields([Client, clientsModelFields], req.body);
      req.newClient.workSpaceId = workSpace.id;
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      checkPermissions(requester);
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
      checkPermissions(requester);
      req.filter = await modelsService.searchFilter(searchFields, req.query);
      // console.log(req.filter);
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const requester = req.user.role;
      checkPermissions(requester);
      if (requester !== 'ADMIN' && req.params.id < 3) {
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
      checkPermissions(requester);
      if (requester !== 'ADMIN' && req.params.id < 3) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ClientsRouterMiddleware();
