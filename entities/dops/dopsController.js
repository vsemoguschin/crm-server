const ApiError = require('../../error/apiError');
const Dop = require('./dopsModel');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require('../../utils/clearEmptyFields');
class dopsController {
  async create(req, res, next) {
    try {
      const { new_dop } = req;
      const dop = await Dop.create(new_dop);
      return res.json(dop);
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const dop = await Dop.findOne({ where: { id } });
      return res.json(dop);
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const { userId, dealId, pageNumber, size } = req.query;
    const { limit, offset } = getPagination(pageNumber, size);
    try {
      const filter = clearEmptyFields({ userId, dealId });
      const dops = await Dop.findAll({
        where: filter,
        order: ['createdAt'],
        limit,
        offset,
      });
      const resData = getPaginationData(dops, pageNumber, limit, 'dops');
      return res.json(resData);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res) {}
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedDop = await Dop.destroy({ where: id });
      if (deletedDop === 0) {
        return res.json('Доп не удален');
      }
      return res.json('Доп удален');
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new dopsController();
