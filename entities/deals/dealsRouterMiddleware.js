const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields, Deal } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');
const dealsPermissions = require('./dealsPermissions');
const { Op } = require('sequelize');
const { Order, Delivery } = require('../association');

const frontOptions = {
  modelFields: modelsService.getModelFields(dealsModelFields),
};

class DealsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);
      const newDeal = await modelsService.checkFields([Deal, dealsModelFields], req.body);
      req.newDeal = newDeal;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);
      const { id } = req.params;
      const deal = await Deal.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Client,
            attributes: ['id', 'fullName', 'chatLink'],
          },
          {
            model: Order,
            include: ['neons', 'executors', 'files', 'stage'],
          },
          {
            model: Delivery,
            include: ['orders'],
          },
          'payments',
          'dops',
          'files',
        ],
      });
      if (!deal) {
        throw ApiError.NotFound('Deal not found');
      }
      req.deal = deal;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const searchFields = ['title', 'clothingMethod', 'status'];

    try {
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);
      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          ...searchFilter,
        },
        // attributes: ['id', 'title', 'price', 'clothingMethod', 'deadline', 'status', 'createdAt'],
      };
      const { workSpace } = req;
      if (req.baseUrl.includes('/workspaces') && workSpace.department !== 'COMMERCIAL') {
        console.log(false, 'wrong workspace department');
        throw ApiError.BadRequest('wrong workspace department');
      }
      if (req.baseUrl.includes('/clients')) {
        searchParams.where.clientId = req.params.id;
      }
      if (req.baseUrl.includes('/users')) {
        searchParams.where.userId = req.params.id;
      }
      if (req.baseUrl.includes('/workspaces')) {
        searchParams.where.workSpaceId = workSpace.id;
        searchParams.include = [
          'client',
          {
            model: Order,
            include: ['stage', 'files'],
          },
          'files',
        ];
      }
      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsRouterMiddleware();
