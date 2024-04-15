const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields, Deal, DealUsers, DealDates } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');
const dealsPermissions = require('./dealsPermissions');
const { Op } = require('sequelize');
const { Order, Delivery, User } = require('../association');

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
          'dealers',
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
          'dealDate',
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
    const searchFields = ['title', 'clothingMethod', 'status', 'cardLink', 'city', 'region', 'discont', 'adTag', 'source'];

    try {
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);
      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          ...searchFilter,
        },
        include: ['dealDate'],
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
  async addDealers(req, res, next) {
    try {
      const { deal, user: newSeller } = req;
      let { part } = req.body;
      if (!part || isNaN(part) || part > 1 || part <= 0) {
        throw ApiError.BadRequest('wrong part');
      }
      part = +part;
      if (deal.dealers.length >= 2 && !deal.dealers.find((user) => user.id === newSeller.id)) {
        throw ApiError.BadRequest('deal already has 2 dealers');
      }
      const sale = {
        userId: newSeller.id,
        dealId: deal.id,
        part,
      };
      if (deal.dealers.length === 0) {
        sale.part = 1;
        await DealUsers.create(sale);
        return res.json(200);
      }
      if (deal.dealers.find((user) => user.id === newSeller.id)) {
        const newSale = await DealUsers.findAll({ where: { dealId: deal.id } });
        await DealUsers.update({ part: part }, { where: { dealId: deal.id, userId: newSeller.id } });
        const oldSale = await DealUsers.findOne({ where: { dealId: deal.id, userId: { [Op.ne]: newSeller.id } } });
        await oldSale.update({ part: 1 - part });
        return res.json(200);
      }
      const newSale = await DealUsers.create(sale);
      const oldSale = await DealUsers.findOne({ where: { dealId: deal.id } });
      await oldSale.update({ part: 1 - part });

      return res.json(newSale);
    } catch (e) {
      next(e);
    }
  }
  async deleteDealers(req, res, next) {
    try {
      const { deal, user } = req;
      const seller = await DealUsers.findOne({ where: { dealId: deal.id, userId: user.id } });
      if (!seller) {
        throw ApiError.BadRequest('seller not in deal');
      }
      await seller.destroy();
      const saller = await DealUsers.findOne({
        where: { dealId: deal.id },
      });
      if (saller) {
        await saller.update({ part: 1 });
      }
      await res.json(200);
    } catch (e) {
      next(e);
    }
  }
  async getDealers(req, res, next) {
    try {
      const { deal } = req;

      res.json(deal.dealers);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsRouterMiddleware();
