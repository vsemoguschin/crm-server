const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: deliveriesModelFields, Delivery } = require('./deliveriesModel');
const { Deal, Order } = require('../association');

const frontOptions = {
  modelFields: modelsService.getModelFields(deliveriesModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['method', 'type', 'description', 'city', 'recived', 'readyToSend'];
const searchFields = ['method', 'type', 'description', 'city', 'track', 'status'];
class DeliverysRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const deal = await Deal.findOne({
        where: { id: req.params.id },
      });
      if (!deal) {
        console.log(false, 'No deal');
        throw ApiError.BadRequest('No deal');
      }
      const newDelivery = await modelsService.checkFields([Delivery, deliveriesModelFields], req.body);
      req.newDelivery = newDelivery;
      req.deal = deal;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester) && !['DP', 'RP', 'PACKER'].includes(requester)) {
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
      if (!permissions.includes(requester) && !['DP', 'RP', 'PACKER'].includes(requester)) {
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
      if (['ADMIN', 'G', 'DP', 'RP', 'PACKER'].includes(requester)) {
        req.updateFields = ['price', 'track', 'status'];
      }
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
  async addOrders(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const delivery = await Delivery.findOne({
        where: { id: +req.params.id },
        // attributes: ['id'],
        include: ['orders'],
      });
      const order = await Order.findOne({
        where: { id: +req.params.orderId },
      });
      if (!delivery || !order) {
        console.log(false, 'No delivery or order');
        throw ApiError.BadRequest('No delivery or order');
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
      // console.log(delivery.id);
      req.params.id = req.params.orderId;
      req.delivery = delivery;
      req.updates = { deliveryId: delivery.id };
      next();
    } catch (e) {
      next(e);
    }
  }
  async deleteOrders(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const delivery = await Delivery.findOne({
        where: { id: +req.params.id },
        attributes: ['id'],
        include: ['orders'],
      });
      const order = await Order.findOne({
        where: { id: +req.params.orderId },
      });
      if (!delivery || !order) {
        console.log(false, 'No delivery or order');
        throw ApiError.BadRequest('No delivery or order');
      }
      if (delivery.dataValues.orders.length === 1) {
        await delivery.update({ workSpaceId: null });
      }
      // console.log(delivery.id);
      req.params.id = req.params.orderId;
      req.updates = { deliveryId: null };
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DeliverysRouterMiddleware();
