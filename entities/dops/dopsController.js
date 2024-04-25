const { Dop, modelFields: dopsModelFields } = require('./dopsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const planService = require('../../services/planService');

class DopsController {
  async create(req, res, next) {
    try {
      const { deal, newDop } = req;
      newDop.userId = req.requester.id;
      const dop = await deal.createDop(newDop);
      await planService.createDop(dop);
      return res.json(dop);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { dop } = req;
      return res.json(dop);
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

      const dops = await Dop.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(dops, current, pageSize, 'dops');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const updateFields = ['title', 'type', 'price', 'description'];
    try {
      const { dop } = req;
      const body = checkRepeatedValues(dop, req.body);
      const updates = await modelsService.checkUpdates([Dop, dopsModelFields], body, updateFields);

      if (updates.price) {
        await planService.updateDop(dop, updates.price);
      }

      await dop.update(updates);
      return res.json(dop);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { dop } = req;
      await planService.deleteDop(dop);
      const deletedDop = await dop.destroy();
      // console.log(deletedDop);
      if (deletedDop === 0) {
        console.log('Доп не удалена');
        return res.json('Доп не удалена');
      }
      console.log('Доп удалена');
      return res.json('Доп удалена');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DopsController();
