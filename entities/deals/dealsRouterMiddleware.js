const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields, Deal, Dealers } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');
const dealsPermissions = require('./dealsPermissions');
const { Op } = require('sequelize');
const { Delivery, ManagersPlan, Dop, User } = require('../association');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const { group } = require('console');

const frontOptions = {
  modelFields: modelsService.getModelFields(dealsModelFields),
};

class DealsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);
      console.log(req.body);
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
          // 'dealers',
          {
            association: 'dealers',
            include: ['role'],
            // attributes: ['id', 'fullName', 'chatLink'],
          },
          {
            model: Client,
            // attributes: ['id', 'fullName', 'chatLink'],
          },
          {
            model: Delivery,
            // include: ['orders'],
          },
          'dealDate',
          'payments',
          'preorder',
          'orders',
          // 'dops',
          {
            model: Dop,
            include: ['user'],
          },
        ],
      });
      if (!deal) {
        throw ApiError.NotFound('Deal not found');
      }
      // console.log(deal.dops);
      const dopsPrice = deal.dops.length > 0 ? deal.dops.reduce((a, b) => a + b.price, 0) : 0;
      const recievedPay = deal.payments.length > 0 ? deal.payments.reduce((a, b) => a + b.price, 0) : 0;
      const totalPrice = deal.price + dopsPrice;
      const remainder = totalPrice - recievedPay;
      deal.dataValues.dopsPrice = dopsPrice;
      deal.dataValues.recievedPay = recievedPay;
      deal.dataValues.totalPrice = totalPrice;
      deal.dataValues.remainder = remainder;
      req.deal = deal;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getListOfDeals(req, res, next) {
    const searchFields = ['title', 'status', 'clothingMethod', 'source', 'adTag', 'discont', 'sphere', 'city', 'region', 'cardLink', 'paid'];

    try {
      const requesterRole = req.requester.role;
      dealsPermissions(requesterRole);

      const { pageSize, current, start, end, key, order, chatLink } = req.query;
      checkReqQueriesIsNumber({ pageSize, current });
      const dateStart = new Date(start || '2000-03-17');
      const dateEnd = new Date(end || '2500-04-26');

      const keys = ['price', 'dopsPrice', 'payments', 'totalPrice', 'remainder'];

      const sortFilter = {
        apply: key && order ? true : false,
        key: keys.includes(key) ? key : null,
        order: ['DESC', 'ASC'].includes(order) ? order : 'DESC',
      };

      const searchFilter = await modelsService.dealListFilter(searchFields, req.query);
      console.log(searchFilter, 3232092049);
      let searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          createdAt: {
            [Op.gt]: dateStart == 'Invalid Date' ? '2000-01-01' : dateStart,
            [Op.lt]: dateEnd == 'Invalid Date' ? '2500-01-01' : dateEnd,
          },
          ...searchFilter,
        },
        include: ['dops', 'payments', 'dealers', 'client', 'deliveries', 'workSpace'],
      };

      if (chatLink) {
        searchParams = {
          where: {
            id: { [Op.gt]: 0 },
            createdAt: {
              [Op.gt]: dateStart == 'Invalid Date' ? '2000-01-01' : dateStart,
              [Op.lt]: dateEnd == 'Invalid Date' ? '2500-01-01' : dateEnd,
            },
          },
          include: [
            'dops',
            'payments',
            'dealers',
            'deliveries',
            'workSpace',
            {
              model: Client,
              where: {
                chatLink: { [Op.regexp]: chatLink },
              },
            },
          ],
        };
      }

      //other paths
      const { workSpace, manager, group } = req;
      if (req.baseUrl.includes('/workspaces') && workSpace.department !== 'COMMERCIAL') {
        console.log(false, 'wrong workspace department');
        throw ApiError.BadRequest('wrong workspace department');
      }
      if (req.baseUrl.includes('/clients')) {
        searchParams.where.clientId = req.params.id;
      }
      if (req.baseUrl.includes('/groups')) {
        searchParams.where.groupId = group.id;
      }
      if (req.baseUrl.includes('/managers')) {
        // searchParams.where.userId = manager.id;
        console.log('/managers/', 313232);
        searchParams.include.push({
          model: User,
          as: 'dealers',
          where: {
            id: manager.id,
          },
        });
      }
      if (req.baseUrl.includes('/workspaces')) {
        searchParams.where.workSpaceId = workSpace.id;
      }
      req.searchParams = searchParams;
      req.searchFilter = searchFilter;
      req.sortFilter = sortFilter;
      req.pageSize = pageSize;
      req.current = current;
      next();
    } catch (e) {
      next(e);
    }
  }
  async addDealers(req, res, next) {
    try {
      const { deal, user: newDealer } = req;
      let { part } = req.body;
      if (deal.dealers.length >= 2 && !deal.dealers.find((user) => user.id === newDealer.id)) {
        throw ApiError.BadRequest('deal already has 2 dealers');
      }
      if (deal.dealers.length == 1 && deal.dealers[0].id == newDealer.id) {
        throw ApiError.BadRequest('only one dealer');
      }
      if (!part || isNaN(part) || part >= 1 || part <= 0) {
        throw ApiError.BadRequest('wrong part');
      }
      part = +part;

      const dealPayments = deal.payments.reduce((a, b) => a + b.price, 0);

      // console.log(+part.toFixed(1));
      const newDealerPart = +part.toFixed(1); //часть нового диллера
      const newDealerPrice = +(deal.price * newDealerPart).toFixed(); //сумма части
      const newDealerPayments = +(dealPayments * newDealerPart).toFixed();

      //продажа нового диллера
      const newDealerSale = {
        userId: newDealer.id,
        dealId: deal.id,
        part: newDealerPart,
        price: newDealerPrice,
        payments: newDealerPayments,
      };
      //продажа первого диллера
      const dealDealer = deal.dealers[0].dealUsers;

      //период
      const period = deal.createdAt.toISOString().slice(0, 7);

      //добавление нового диллера в сделку
      await Dealers.findOrCreate({ where: newDealerSale });
      //обновление данных первого диллера
      const dealDealerNewPart = +(1 - newDealerSale.part).toFixed(1);
      const dealDealerNewPayments = dealPayments - newDealerPayments;
      // console.log(dealDealerNewPart, 21321);
      await dealDealer.update({
        part: dealDealerNewPart,
        price: deal.price - newDealerSale.price,
        payments: dealDealerNewPayments,
      });

      //ОБНОВЛЕНИЕ ПЛАНОВ ДИЛЛЕРОВ
      //поиск плана нового диллера
      const [newDealerPlan] = await ManagersPlan.findOrCreate({
        where: {
          userId: newDealer.id,
          period,
        },
        defaults: {
          userId: newDealer.id,
          period,
        },
      });
      //обновление плана нового диллера
      newDealerPlan.dealsSales += newDealerPrice; //добавляем сумму сделки
      newDealerPlan.dealsAmount += 1; // +1 сделка
      newDealerPlan.receivedPayments += newDealerPayments; //прибавляем платежи
      await newDealerPlan.save();

      //поиск плана первого диллера
      const dealDealerPlan = await ManagersPlan.findOne({
        where: {
          userId: deal.dealers[0].id,
          period,
        },
      });
      //обновление плана первого диллера
      dealDealerPlan.dealsSales -= newDealerPrice;
      dealDealerPlan.receivedPayments -= newDealerPayments; //отнимаем платежи
      console.log(newDealerPlan.receivedPayments, newDealerPayments);
      await dealDealerPlan.save();

      // console.log(dealDealerPlan, 3242);
      await deal.update({ groupId: newDealer.groupId });

      return res.json(200);
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

      const dealPayments = deal.payments.reduce((a, b) => a + b.price, 0);

      const removedSeller = deal.dealers.find((d) => d.id === user.id);
      const dealSeller = deal.dealers.find((d) => d.id !== user.id);
      // console.log(removedSeller.dealUsers, dealSeller.fullName);

      //Обновление части оставшегося диллера
      await dealSeller.dealUsers.update({
        part: 1,
        price: deal.price,
        payments: dealPayments,
      });

      //ОБНОВЛЕНИЕ ПЛАНОВ ДИЛЛЕРОВ
      //период
      const period = deal.createdAt.toISOString().slice(0, 7);
      //поиск и обновление плана удаленного диллера
      const removedSellerPlan = await ManagersPlan.findOne({
        where: {
          userId: removedSeller.id,
          period,
        },
      });
      //обновление плана
      removedSellerPlan.dealsSales -= removedSeller.dealUsers.price; //вычитаем сумму части
      removedSellerPlan.dealsAmount -= 1; // -1 сделка
      removedSellerPlan.receivedPayments -= removedSeller.dealUsers.payments; //вычитаем платежи
      await removedSellerPlan.save();

      //поиск и обновление оставшегося диллера
      const dealSellerPlan = await ManagersPlan.findOne({
        where: {
          userId: dealSeller.id,
          period,
        },
      });
      //обновление плана
      dealSellerPlan.dealsSales += removedSeller.dealUsers.price; //добавляем сумму части
      dealSellerPlan.receivedPayments += removedSeller.dealUsers.payments; //прибавляем платежи
      await dealSellerPlan.save();

      //Удаление дилера из сделки
      await removedSeller.dealUsers.destroy();
      await deal.update({ groupId: dealSeller.groupId });
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
