const { Deal, modelFields: dealsModelFields } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

class DealsController {
  async create(req, res, next) {
    try {
      const { client, newDeal } = req;

      newDeal.userId = req.requester.id;
      newDeal.workSpaceId = client.workSpaceId;

      const deal = await client.createDeal(newDeal);
      await deal.addSellers(req.requester.id);

      return res.json(deal);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { deal } = req;
      return res.json(deal);
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
      console.log(searchParams);

      const deals = await Deal.findAndCountAll({
        ...searchParams,
        distinct: true,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(deals, current, pageSize, 'deals');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const updateFields = ['title', 'chatLink', 'clothingMethod', 'deadline', 'description', 'price', 'status'];

    try {
      const { deal } = req;

      const body = checkRepeatedValues(deal, req.body);
      const updates = await modelsService.checkUpdates([Deal, dealsModelFields], body, updateFields);

      await deal.update(updates);
      return res.json(deal);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { deal } = req;
      const deletedDeal = await deal.destroy();
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
}

module.exports = new DealsController();
