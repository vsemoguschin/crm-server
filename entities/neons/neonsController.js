const { Neon, modelFields: neonsModelFields } = require('./neonsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
class NeonsController {
  async create(req, res, next) {
    try {
      const { order, newNeon } = req;
      newNeon.userId = req.requester.id;
      const neon = await order.createNeon(newNeon);
      return res.json(neon);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { neon } = req;
      return res.json(neon);
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

      const neons = await Neon.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(neons, current, pageSize, 'neons');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const updateFields = ['width', 'length', 'color', 'type'];

    try {
      const { neon } = req;
      const body = checkRepeatedValues(neon, req.body);

      const updates = await modelsService.checkUpdates([Neon, neonsModelFields], body, updateFields);

      await neon.update(updates);
      return res.json(neon);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { neon } = req;
      const deletedNeon = await neon.destroy();
      // console.log(deletedNeon);
      if (deletedNeon === 0) {
        console.log('Неон не удален');
        return res.json('Неон не удален');
      }
      console.log('Неон удален');
      return res.json('Неон удален');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new NeonsController();
