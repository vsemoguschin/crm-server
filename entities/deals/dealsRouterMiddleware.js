const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields, Deal, Dealers, DealDates } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');
const dealsPermissions = require('./dealsPermissions');
const { Op } = require('sequelize');
const { Order, Delivery, User, ManagersPlan } = require('../association');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

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
  async getDeal(req, res, next) {
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
  async getListOfDeals(req, res, next) {
    const searchFields = ['title', 'price', 'status', 'clothingMethod', 'source', 'adTag', 'discont', 'sphere', 'city', 'region', 'cardLink', 'paid'];

    try {
      const {
        pageSize,
        current,
        year,
        month,
        day, //?
      } = req.query;
      checkReqQueriesIsNumber({ pageSize, current, year, month, day });
      if (!year || !month) {
        throw ApiError.BadRequest('необходимо передать период');
      }
      if (+month > 12 || +month < 1) {
        throw ApiError.BadRequest('wrong month');
      }
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);
      const monthDays = new Date(year, month, '0').getDate();
      let monthPlan = await ManagersPlan.findOne({
        where: {
          userId: 2,
          period: new Date(year, month, '0'),
        },
      });
      monthPlan = monthPlan?.plan || 0;
      console.log(monthPlan);
      let periodStart = new Date(year, month - 1, '2');
      let periodEnd = new Date(year, month);

      if (day && +day < monthDays && +day > 0) {
        periodStart = new Date(year, month - 1, day);
        periodEnd = new Date(year, month - 1, +day + 1);
      }
      if ((day && +day > monthDays) || +day < 0) {
        throw ApiError.BadRequest('wrong day');
      }
      // return console.log(periodStart, periodEnd);
      const dateSearch = {
        createdAt: {
          [Op.gt]: periodStart,
          [Op.lt]: periodEnd,
        },
      };
      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          ...searchFilter,
          ...dateSearch,
        },
        include: ['dops', 'payments', 'dealers', 'client', 'deliveries'],
        // include: ['dealDate', 'payments', 'deliveries', 'client', 'dealers'],
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
      req.monthPlan = monthPlan;
      next();
    } catch (e) {
      next(e);
    }
  }
  async addDealers(req, res, next) {
    try {
      const { deal, user: newSeller } = req;
      let { part } = req.body;
      if (deal.dealers.length >= 2 && !deal.dealers.find((user) => user.id === newSeller.id)) {
        throw ApiError.BadRequest('deal already has 2 dealers');
      }
      if (deal.dealers.length == 1 && deal.dealers[0].id == newSeller.id) {
        throw ApiError.BadRequest('only one dealer');
      }
      if (!part || isNaN(part) || part >= 1 || part <= 0) {
        throw ApiError.BadRequest('wrong part');
      }
      part = +part;
      console.log(+part.toFixed(1));
      const newSellerPart = +part.toFixed(1);
      const newSellerPrice = +(deal.price * newSellerPart).toFixed();

      const sale = {
        userId: newSeller.id,
        dealId: deal.id,
        part: newSellerPart,
        price: newSellerPrice,
      };

      const dateObj = new Date(deal.createdAt);
      const month = dateObj.getUTCMonth() + 1;
      const year = dateObj.getUTCFullYear();

      // меняем у участника сделки данные
      if (deal.dealers.find((user) => user.id === newSeller.id)) {
        const updatedDealer = await Dealers.findOne({ where: { dealId: deal.id, userId: newSeller.id } });
        const secondDealer = await Dealers.findOne({ where: { dealId: deal.id, userId: { [Op.ne]: newSeller.id } } });

        const updatedDealerPlan = await ManagersPlan.findOne({
          where: {
            userId: newSeller.id,
            period: new Date(year, month, '0'),
          },
        });
        updatedDealerPlan.dealsSales += newSellerPrice - updatedDealer.price;
        await updatedDealerPlan.save();

        const secondDealerPlan = await ManagersPlan.findOne({
          where: {
            userId: secondDealer.userId,
            period: new Date(year, month, '0'),
          },
        });
        secondDealerPlan.dealsSales += deal.price - newSellerPrice - secondDealer.price;
        await secondDealerPlan.save();

        await updatedDealer.update({ part: newSellerPart, price: newSellerPrice });
        await secondDealer.update({ part: (1 - part).toFixed(1), price: deal.price - newSellerPrice });
        return res.json(200);
      }
      const newDealer = await Dealers.create(sale);
      const newDealerPlan = await ManagersPlan.findOne({
        where: {
          userId: newSeller.id,
          period: new Date(year, month, '0'),
        },
      });
      newDealerPlan.dealsSales += newSellerPrice;
      newDealerPlan.dealsAmount += 1;
      await newDealerPlan.save();

      const secondDealer = await Dealers.findOne({ where: { dealId: deal.id } });
      await secondDealer.update({ part: (1 - part).toFixed(1), price: deal.price - newSellerPrice });
      const secondDealerPlan = await ManagersPlan.findOne({
        where: {
          userId: secondDealer.userId,
          period: new Date(year, month, '0'),
        },
      });
      secondDealerPlan.dealsSales -= newSellerPrice;
      await secondDealerPlan.save();

      return res.json(newDealer);
    } catch (e) {
      next(e);
    }
  }
  async deleteDealers(req, res, next) {
    try {
      const { deal, user } = req;
      if (deal.dealers.length == 1) {
        throw ApiError.BadRequest('Что бы удалить, надо сначала добавить нового');
      }
      const seller = await Dealers.findOne({ where: { dealId: deal.id, userId: user.id } });
      if (!seller) {
        throw ApiError.BadRequest('seller not in deal');
      }
      const dateObj = new Date(deal.createdAt);
      const month = dateObj.getUTCMonth() + 1;
      const year = dateObj.getUTCFullYear();

      const sellerPlan = await ManagersPlan.findOne({
        where: {
          userId: seller.userId,
          period: new Date(year, month, '0'),
        },
      });
      sellerPlan.dealsSales -= seller.price;
      sellerPlan.dealsAmount -= 1;
      await sellerPlan.save();

      const secondDealer = await Dealers.findOne({ where: { dealId: deal.id } });
      await secondDealer.update({ part: 1, price: deal.price });
      const secondDealerPlan = await ManagersPlan.findOne({
        where: {
          userId: secondDealer.userId,
          period: new Date(year, month, '0'),
        },
      });
      secondDealerPlan.dealsSales += seller.price;
      await secondDealerPlan.save();
      // console.log(seller);
      await seller.destroy();
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

const year = 2024;
const month = 3;
const day = 17;

const periodStart = new Date(year, month - 1, day);
const periodEnd = new Date(year, month - 1, day + 1);
console.log(periodStart);
console.log(periodEnd);

module.exports = new DealsRouterMiddleware();
