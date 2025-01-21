const { Delivery, modelFields: deliveryModelFields } = require('./deliveriesModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Order, Client, Deal } = require('../association');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const ApiError = require('../../error/apiError');

class DeliveriesController {
  async create(req, res, next) {
    try {
      const { newDelivery, deal } = req;
      newDelivery.userId = req.requester.id;
      const delivery = await deal.createDelivery(newDelivery);
      return res.json(delivery);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { delivery } = req;
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
      const { searchParams } = req;

      const deliveries = await Delivery.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(deliveries, current, pageSize, 'deliveries');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const updateFields = ['method', 'type', 'description', 'track', 'status', 'price'];

    try {
      const { delivery } = req;
      const body = checkRepeatedValues(delivery, req.body);
      console.log(31323, body);
      const updates = await modelsService.checkUpdates([Delivery, deliveryModelFields], body, updateFields);
      await delivery.update(updates);
      return res.json(delivery);
    } catch (e) {
      next(e);
    }
  }
  async sent(req, res, next) {
    try {
      const { delivery } = req;
      const { track, price } = req.body;
      if (delivery.status !== 'Доступна') {
        throw ApiError.BadRequest('Доставка не доступна');
      }
      console.log(delivery.method);
      if (['СДЕК', 'ПОЧТА', 'Курьер', 'Балтийский курьер'].includes(delivery.method) && !track) {
        throw ApiError.BadRequest('Необходимо указать трек');
      }
      if (!price && delivery.method !== 'Самовывоз') {
        throw ApiError.BadRequest('Необходимо указать стоимость доставки');
      }
      const updates = await modelsService.checkUpdates([Delivery, deliveryModelFields], req.body, ['track', 'price']);
      await delivery.update({ status: 'Отправлена', ...updates });
      return res.json(delivery);
    } catch (e) {
      next(e);
    }
  }
  async ready(req, res, next) {
    try {
      const { delivery } = req;
      if (delivery.status !== 'Создана') {
        throw ApiError.BadRequest('Доставка не доступна');
      }
      await delivery.update({ status: 'Доступна' });
      return res.json(delivery);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { delivery } = req;
      const deletedDelivery = await delivery.destroy();
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
            deliveryId: delivery.id,
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
