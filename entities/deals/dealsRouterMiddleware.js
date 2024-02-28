const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields, Deal } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');
const dealsPermissions = require('./dealsPermissions');

const frontOptions = {
  modelFields: modelsService.getModelFields(dealsModelFields),
};
const updateFields = ['title', 'chatLink', 'clothingMethod', 'deadline', 'description', 'price', 'status'];
const searchFields = ['title', 'clothingMethod', 'status'];

class DealsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      dealsPermissions(requester);
      const client = await Client.findOne({
        where: { id: req.params.id },
      });
      if (!client) {
        console.log(false, 'No client');
        throw ApiError.BadRequest('No client');
      }

      const newDeal = await modelsService.checkFields([Deal, dealsModelFields], req.body);
      req.newDeal = newDeal;
      req.client = client;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      dealsPermissions(requester);
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      const { workSpace } = req;
      console.log(workSpace);
      if (req.baseUrl.includes('/workspaces') && workSpace.department !== 'COMMERCIAL') {
        console.log(false, 'wrong workspace department');
        throw ApiError.BadRequest('wrong workspace department');
      }
      dealsPermissions(requester);
      req.searchFields = searchFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const requester = req.user.role;
      dealsPermissions(requester);
      req.updateFields = updateFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      dealsPermissions(requester);
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsRouterMiddleware();
