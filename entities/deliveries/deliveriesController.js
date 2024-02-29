const { Delivery, modelFields: deliveryModelFields } = require('./deliveriesModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Order, Client, Deal } = require('../association');
const { Op } = require('sequelize');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

class DeliveriesController {
  async create(req, res, next) {
    try {
      const { newDelivery, deal } = req;
      const delivery = await Delivery.create({
        ...newDelivery,
        userId: req.user.id,
        dealId: deal.id,
      });
      return res.json(delivery);
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
        include: ['orders', 'workSpace'],
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
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);

      let options = {
        where: {
          id: { [Op.gt]: 0 },
          ...filter,
        },
      };
      if (req.baseUrl.includes('/deals')) {
        options.where = { dealId: +req.params.id };
        options.include = ['orders'];
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
          status: ['Создана', 'Доступна'],
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
  async workSpaceList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { workSpace } = req;
      const searchFields = ['method', 'type', 'description', 'city', 'track', 'status'];
      const filter = await modelsService.searchFilter(searchFields, req.query);
      console.log(filter);

      const deals = await Deal.findAndCountAll({
        attributes: ['id', 'title', 'deadline', 'createdAt'],
        include: [
          'files',
          {
            model: Client,
            attributes: ['id', 'chatLink'],
          },
          {
            model: Delivery,
            where: {
              ...filter,
              // status: 'Доступна',
              workSpaceId: workSpace.id,
            },
            include: [
              {
                model: Order,
                attributes: ['id', 'name', 'stageId', 'boardWidth', 'boardHeight', 'status'],
              },
            ],
          },
        ],
        distinct: true,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(deals, current, pageSize, 'deliveries');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DeliveriesController();
