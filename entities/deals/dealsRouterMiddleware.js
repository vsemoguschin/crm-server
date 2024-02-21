const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields, Deal } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');

const frontOptions = {
  modelFields: modelsService.getModelFields(dealsModelFields),
};
const updateFields = ['title', 'chatLink', 'clothingMethod', 'deadline', 'description', 'price', 'status'];
const searchFields = ['title', 'clothingMethod', 'status'];

class DealsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
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
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      req.searchFields = searchFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      req.updateFields = updateFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsRouterMiddleware();
