const ApiError = require('../../error/apiError');
const File = require('./filesModel');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require('../../utils/clearEmptyFields');
class filesController {
  async create(req, res, next) {
    try {
      const { new_file } = req;
      const file = await File.create(new_file);
      return res.json(file);
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const file = await File.findOne({ where: { id } });
      return res.json(file);
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const { userId, dealId, pageNumber, size } = req.query;
    const { limit, offset } = getPagination(pageNumber, size);
    try {
      const filter = clearEmptyFields({ userId, dealId });
      const files = await File.findAll({
        where: filter,
        order: ['createdAt'],
        limit,
        offset,
      });
      const resData = getPaginationData(files, pageNumber, limit, 'files');
      return res.json(resData);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res) {}
  async delete(req, res) {}
}

module.exports = new filesController();
