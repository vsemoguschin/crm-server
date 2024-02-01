const { Order, modelFields: ordersModelFields } = require('./ordersModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
class OrdersController {
  async create(req, res, next) {
    try {
      const { newOrder } = req;
      const order = await Order.create({
        ...newOrder,
        userId: req.user.id,
        dealId: req.body.dealId,
      });
      return res.json(order);
    } catch (e) {
      console.log(e);
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: {
          id,
        },
        include: 'neons'
      });
      return res.json(order);
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
      const orders = await Order.findAndCountAll({
        where: filter,
        order,
        limit,
        offset,
        // include: 'orders',
      });
      const response = getPaginationData(
        orders,
        pageNumber,
        pageSize,
        "orders"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { updates } = req.body;
      const [updated, order] = await Order.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(order)
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedOrder);
      if (deletedOrder === 0) {
        console.log('Заказ не удален');
        return res.json('Заказ не удален');
      }
      console.log('Заказ удален');
      return res.json('Заказ удален');
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new OrdersController();
