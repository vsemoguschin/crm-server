const { Order } = require('./ordersModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Op } = require('sequelize');
const { Deal } = require('../association');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');

const searchFields = ['name'];
class OrdersController {
  async create(req, res, next) {
    try {
      const { newOrder } = req;
      const order = await Order.create({
        ...newOrder,
        userId: req.user.id,
        dealId: req.params.id,
      });
      return res.json(order);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: {
          id,
        },
        include: ['neons', 'files', 'executors', 'delivery'],
      });
      if (!order) {
        return res.status(404).json('order not found');
      }
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const filter = await modelsService.searchFilter(searchFields, req.query);
      const options = {
        where: {
          id: { [Op.gt]: 0 },
          ...filter,
        },
        include: [],
      };
      if (req.baseUrl.includes('/deals')) {
        options.where.dealId = req.params.id;
        options.include = ['neons', 'executors', 'files', 'stage'];
      }
      if (req.baseUrl.includes('/deliveries')) {
        options.where.deliveryId = req.params.id;
        options.include = ['stage'];
      }
      const orders = await Order.findAndCountAll({
        ...options,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(orders, current, pageSize, 'orders');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { updates } = req;
      const order = await Order.findOne({
        where: {
          id: id,
        },
      });
      // console.log(order);
      if (!order) {
        console.log(false, 'no acces');
        throw ApiError.BadRequest('no order found');
      }
      await order.update(updates);
      if (req.baseUrl.includes('/workspaces')) {
        await Deal.update(
          {
            status: 'process',
          },
          {
            where: {
              id: order[0].dealId,
            },
          },
        );
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.destroy({
        where: {
          id,
          stage: null,
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
      next(e);
    }
  }

  //просмотр заказов в пространстве
  async stageList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
      status,
    } = req.query;
    try {
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const searchFields = ['title'];
      const filter = await modelsService.searchFilter(searchFields, req.query);
      const { workSpace } = req;
      const { stageId } = req.params;
      const orders = await Deal.findAndCountAll({
        where: {
          ...filter,
        },
        attributes: ['id', 'title', 'deadline', 'createdAt'],
        include: [
          {
            model: Order,
            where: {
              workSpaceId: workSpace.id,
              stageId,
              status: status || ['Доступен', 'В работе', 'Выполнен'],
            },
            include: ['neons', 'executors', 'files'],
            attributes: ['status'],
          },
          'files',
        ],
        distinct: true,
        limit,
        offset,
        order,
      });
      return res.json(orders);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrdersController();
