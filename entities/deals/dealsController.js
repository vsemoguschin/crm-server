const { Client, Order, Delivery } = require('../association');
const { Deal, modelFields: dealsModelFields } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Op } = require('sequelize');

class DealsController {
  async create(req, res, next) {
    try {
      const { client, newDeal } = req;

      newDeal.userId = req.user.id;
      newDeal.status = 'created';
      newDeal.workSpaceId = client.workSpaceId;

      const deal = await client.createDeal(newDeal);

      return res.json(deal);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const deal = await Deal.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Client,
            attributes: ['id', 'fullName', 'chatLink'],
          },
          {
            model: Order,
            include: ['neons', 'executors', 'files', 'stage'],
          },
          {
            model: Delivery,
            include: ['orders'],
          },
          'payments',
          'dops',
          'files',
        ],
      });
      if (!deal) {
        return res.status(404).json('deal not found');
      }
      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      // console.log(filter);
      let modelSearch = {
        id: { [Op.gt]: 0 },
      };
      if (req.baseUrl.includes('/clients')) {
        modelSearch = { clientId: +req.params.id };
      }
      if (req.baseUrl.includes('/workspace')) {
        modelSearch = { workSpaceId: +req.params.id };
      }
      const deals = await Deal.findAndCountAll({
        where: {
          ...filter,
          ...modelSearch,
        },
        attributes: ['id', 'title', 'price', 'clothingMethod', 'deadline', 'status'],
        order,
        limit,
        offset,
      });
      const response = getPaginationData(deals, pageNumber, pageSize, 'deals');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      //придумать обновление превью
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(dealsModelFields, req.body, req.updateFields);

      const [, deal] = await Deal.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(deal);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedDeal = await Deal.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedDeal);
      if (deletedDeal === 0) {
        console.log('Сделка не удалена');
        return res.json('Сделка не удалена');
      }
      console.log('Сделка удалена');
      return res.json('Сделка удалена');
    } catch (e) {
      next(e);
    }
  }

  async commercialList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
      status,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);

      const deals = await Deal.findAndCountAll({
        where: {
          workSpaceId: +req.params.id,
          ...filter,
          status: status || 'process',
        },
        include: [
          { model: Client },
          {
            model: Order,
            include: ['stage', 'files'],
          },
          'files',
        ],
        attributes: ['id', 'title', 'price', 'clothingMethod', 'deadline', 'status', 'workSpaceId'],
        // order,
        limit,
        offset,
      });
      console.log(deals);
      const response = getPaginationData(deals, pageNumber, pageSize, 'deals');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsController();
