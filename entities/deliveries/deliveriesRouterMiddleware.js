const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: deliveriesModelFields, Delivery } = require('./deliveriesModel');
const { Deal, Order } = require('../association');

const frontOptions = {
  modelFields: modelsService.getModelFields(deliveriesModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['method', 'type', 'description', 'city', 'recived', 'readyToSend'];
const searchFields = ['method', 'type', 'description', 'city', 'recived', 'price', 'track', 'sent', 'readyToSend'];
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
      if (!permissions.includes(requester) && !['DP', 'RP', 'PACKER'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updateFields = updateFields;
      if (['DP', 'RP', 'PACKER'].includes(requester)) {
        req.updateFields = ['price', 'track', 'sent'];
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
      // console.log(delivery.id);
      req.params.id = req.params.orderId;
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
      // console.log(delivery.id);
      req.params.id = req.params.orderId;
      req.updates = { deliveryId: null };
      next();
    } catch (e) {
      next(e);
    }
  }
  // async ordersList(req, res, next) {
  //   try {
  //     const requester = req.user.role;
  //     if (!permissions.includes(requester) && !['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
  //       console.log(false, 'no acces');
  //       throw ApiError.Forbidden('Нет доступа');
  //     }
  //     if (!req.params.id || isNaN(+req.params.id)) {
  //       console.log(false, 'Забыл что то указать');
  //       throw ApiError.BadRequest('Забыл что то указать');
  //     }
  //     const delivery = await Delivery.findOne({
  //       where: { id: +req.params.id },
  //       attributes: ['id'],
  //     });
  //     if (!delivery) {
  //       console.log(false, 'No delivery');
  //       throw ApiError.BadRequest('No delivery');
  //     }

  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}

module.exports = new DeliverysRouterMiddleware();
