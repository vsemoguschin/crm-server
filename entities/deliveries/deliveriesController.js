const { Delivery, modelFields: deliveryModelFields } = require('./deliveriesModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const ApiError = require('../../error/apiError');
const { Order } = require('../association');
const orders = '{a:1}';

class DeliveriesController {

  async create(req, res, next) {
    try {
      const { newDelivery } = req;
      const dop = await Delivery.create({
        ...newDelivery,
        userId: req.user.id,
        dealId: req.body.dealId,
      });
      return res.json(dop);
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await Delivery.findOne({
        where: {
          id,
        },
        include: 'orders'
      });
      return res.json(delivery);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key,//?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      const deliveries = await Delivery.findAndCountAll({
        where: filter,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(
        deliveries,
        pageNumber,
        pageSize,
        "deliveries"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(deliveryModelFields, req.body, req.updateFields);
  
      const [updated, delivery] = await Delivery.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(delivery)
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedDelivery = await Delivery.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedDelivery);
      if (deletedDelivery === 0) {
        console.log('Доставка не удалена');
        return res.json('Доставка не удалена');
      }
      console.log('Доставка удалена');
      return res.json('Доставка удалена');
    } catch (e) {
      next(e)
    }
  }
  async addOrders (req, res, next) {
    try {
      const { id } = req.params;
      const ordersIds = JSON.parse(req.body.orders);
      const delivery = await Delivery.findOne({
        where: {id}
      });
      // console.log(delivery);
      const orders = await Order.findAll({
        where: {id: ordersIds}
      });
      // console.log(orders);
      const add = await delivery.addOrder(orders);
      // console.log(deletedDelivery);
      // if (deletedDelivery === 0) {
      //   console.log('Доставка не удалена');
      //   return res.json('Доставка не удалена');
      // }
      // console.log('Доставка удалена');
      return res.json(add);
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new DeliveriesController();
