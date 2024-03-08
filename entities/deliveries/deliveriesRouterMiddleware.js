const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: deliveriesModelFields, Delivery } = require('./deliveriesModel');
const { Deal, Order } = require('../association');
const { Op } = require('sequelize');

const frontOptions = {
  modelFields: modelsService.getModelFields(deliveriesModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
class DeliverysRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const newDelivery = await modelsService.checkFields([Delivery, deliveriesModelFields], req.body);
      req.newDelivery = newDelivery;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole) && !['DP', 'RP', 'PACKER'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const { id } = req.params;
      const delivery = await Delivery.findOne({
        where: {
          id,
        },
        include: ['orders', 'workSpace'],
      });
      if (!delivery) {
        throw ApiError.NotFound('Доставка не найдена');
      }
      req.delivery = delivery;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const searchFields = ['method', 'type', 'description', 'city', 'track', 'status'];

    try {
      const requesterRole = req.requester.role;
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      if (!permissions.includes(requesterRole) && !['DP', 'RP', 'PACKER'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          ...searchFilter,
        },
      };
      if (req.baseUrl.includes('/deals')) {
        searchParams.where = { dealId: +req.params.id, ...searchFilter };
        searchParams.include = ['orders'];
      }
      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }
  async addOrders(req, res, next) {
    try {
      const { delivery, order } = req;
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (delivery.dealId !== order.dealId) {
        throw ApiError.BadRequest('Доставка и заказ из разных сделок');
      }
      if (order.workSpaceId === null) {
        //это значит что перед тем как добавить заказ в доставку, надо ему присвоить воркспейс
        throw ApiError.BadRequest('order has no workSpace');
      }
      if (delivery.workSpaceId !== null && delivery.workSpaceId !== order.workSpaceId) {
        //это значит что перед тем как добавить заказ в доставку, надо ему присвоить воркспейс
        throw ApiError.BadRequest('воркспейсы не совпадают');
      }
      await delivery.update({ workSpaceId: order.workSpaceId });
      await order.update({ deliveryId: delivery.id });
      return res.status(200).json(200);
    } catch (e) {
      next(e);
    }
  }
  async deleteOrders(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const { delivery, order } = req;
      if (delivery.orders.length === 1) {
        await delivery.update({ workSpaceId: null });
      }
      await order.update({ deliveryId: null });
      return res.status(200).json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DeliverysRouterMiddleware();
