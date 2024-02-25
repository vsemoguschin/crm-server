const { Delivery, modelFields: deliveryModelFields } = require('./deliveriesModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Order, Client, Deal } = require('../association');
const { Op } = require('sequelize');

class DeliveriesController {
  async create(req, res, next) {
    try {
      const { newDelivery } = req;
      const dop = await Delivery.create({
        ...newDelivery,
        userId: req.user.id,
        dealId: req.params.id,
      });
      return res.json(dop);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await Delivery.findOne({
        where: {
          id,
        },
        include: 'orders',
      });
      if (!delivery) {
        return res.status(404).json('delivery not found');
      }
      return res.json(delivery);
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

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);

      let options = {
        where: {
          id: { [Op.gt]: 0 },
        },
      };
      if (req.baseUrl.includes('/deals')) {
        options.where = { dealId: +req.params.id };
        options.include = ['orders'];
      }
      if (req.baseUrl.includes('/workspaces')) {
        options = {
          where: {
            readyToSend: true,
            sent: false,
          },
          include: [
            {
              model: Deal,
              workSpaceId: req.params.id,
              attributes: ['id', 'title'],
              include: 'files',
            },
            {
              model: Order,
              attributes: ['id', 'name', 'status'],
              include: 'files',
            },
          ],
        };
      }

      const deliveries = await Delivery.findAndCountAll({
        ...options,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(deliveries, current, pageSize, 'deliveries');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(deliveryModelFields, req.body, req.updateFields);

      const [, delivery] = await Delivery.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(delivery);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
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
      await Order.update(
        {
          deliveryId: null,
        },
        {
          where: {
            deliveryId: id,
          },
        },
      );
      console.log('Доставка удалена');
      return res.json('Доставка удалена');
    } catch (e) {
      next(e);
    }
  }

  async addOrders(req, res, next) {
    try {
      const { id } = req.params;
      const ordersIds = JSON.parse(req.body.orders);
      const delivery = await Delivery.findOne({
        where: { id },
      });
      // console.log(delivery);
      const orders = await Order.findAll({
        where: { id: ordersIds },
      });
      // console.log(orders);
      const add = await delivery.addOrder(orders);
      return res.json(add);
    } catch (e) {
      next(e);
    }
  }
  async ordersList(req, res, next) {
    const { pageSize, current, stageId } = req.query;
    try {
      const { limit, offset } = getPagination(current, pageSize);
      const orders = await Deal.findAndCountAll({
        attributes: ['id', 'title'],
        include: [
          {
            model: Client,
            attributes: ['chatLink'],
          },
          'orders',
          'files',
        ],
        where: {
          '$orders.deliveryId$': req.params.id,
          '$orders.status$': ['Выполнен'],
        },
        // limit,
        // offset,
        // order: { ['DESC']: ['deadline'] },//?
      });
      // const response = getPaginationData(orders, current, pageSize, 'orders');
      return res.json(orders || []);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DeliveriesController();
