const { Deal, modelFields: dealsModelFields, ClothingMethods, DealSources } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');

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
  async getMethods(req, res, next) {
    try {
      const methods = await ClothingMethods.findAll();
      return res.json(methods);
    } catch (e) {
      next(e);
    }
  }
  async createMethods(req, res, next) {
    try {
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [method, created] = await ClothingMethods.findOrCreate({ where: { title } });
      return res.json(method);
    } catch (e) {
      next(e);
    }
  }
  async deleteMethods(req, res, next) {
    try {
      const { methodId } = req.params;
      const method = await ClothingMethods.findOne({ where: { id: methodId } });
      if (method) {
        method.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }

  async getSources(req, res, next) {
    try {
      const { workSpace } = req;
      const sources = await DealSources.findAll({ where: { id: workSpace.id } });
      return res.json(sources);
    } catch (e) {
      next(e);
    }
  }
  async createSources(req, res, next) {
    try {
      const { workSpace } = req;
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [source, created] = await DealSources.findOrCreate({
        where: { title, workSpaceId: workSpace.id },
        defaults: { title, workSpaceId: workSpace.id },
      });
      return res.json(source);
    } catch (e) {
      next(e);
    }
  }
  async deleteSources(req, res, next) {
    try {
      const { workSpace } = req;
      const { sourceId } = req.params;
      const source = await DealSources.findOne({ where: { id: sourceId, workSpaceId: workSpace.id } });
      if (source) {
        source.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsController();
