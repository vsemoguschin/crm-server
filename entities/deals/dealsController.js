const { Client } = require('../association');
const { Deal, modelFields: dealsModelFields } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Op } = require("sequelize");

class DealsController {
  async create(req, res, next) {
    try {
      const { newDeal } = req;
      const deal = await Deal.create({
        ...newDeal,
        userId: req.user.id,
        clientId: req.params.id,
      });

      return res.json(deal);
    } catch (e) {
      console.log(e);
      next(e)
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
          'orders', 'payments', 'dops', 'deliveries', 'files'
        ]
      });
      return res.json(deal);
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
      // console.log(filter);
      let isClient = false;
      if (req.params.id && !isNaN(+req.params.id)) {
        isClient = req.params.id
      }
      const deals = await Deal.findAndCountAll({
        where: {
          ...filter,
          clientId: isClient || { [Op.gt]: 0 }
        },
        attributes: ['id', 'title', 'price', 'clothingMethod'],
        order,
        limit,
        offset,
        // include: 'deals',
      });
      const response = getPaginationData(
        deals,
        pageNumber,
        pageSize,
        "deals"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      //придумать обновление превью
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(dealsModelFields, req.body, req.updateFields);
  
      const [updated, deal] = await Deal.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(deal)
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
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
      next(e)
    }
  }
}

module.exports = new DealsController();
