const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dopsModelFields, Dop } = require('./dopsModel');
const { Op } = require('sequelize');

const frontOptions = {
  modelFields: modelsService.getModelFields(dopsModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class DopsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const newDop = await modelsService.checkFields([Dop, dopsModelFields], req.body);
      req.newDop = newDop;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const { id } = req.params;
      const dop = await Dop.findOne({
        where: {
          id,
        },
      });
      if (!dop) {
        throw ApiError.NotFound('Dop not found');
      }
      req.dop = dop;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const searchFields = ['title', 'type'];
    try {
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);

      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
        },
      };
      if (req.baseUrl.includes('/deals')) {
        searchParams.where.dealId = req.params.id;
      }
      if (req.baseUrl.includes('/users')) {
        const { user } = req;
        searchParams.where.userId = user.id;
      }
      req.searchParams = { ...searchParams, ...searchFilter };
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DopsRouterMiddleware();
