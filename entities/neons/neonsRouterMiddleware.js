const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: neonsModelFields, Neon } = require('./neonsModel');
const { Op } = require('sequelize');

const frontOptions = {
  modelFields: modelsService.getModelFields(neonsModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class NeonsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const newNeon = await modelsService.checkFields([Neon, neonsModelFields], req.body);
      req.newNeon = newNeon;
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
      const neon = await Neon.findOne({
        where: {
          id,
        },
      });
      req.neon = neon;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const searchFields = ['width', 'color', 'type'];
    try {
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      let searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          ...searchFilter,
        },
      };
      if (req.baseUrl.includes('/orders')) {
        const { order } = req;
        searchParams = {
          where: { orderId: order.id },
          ...searchFilter,
        };
      }
      req.searchParams = searchParams;

      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new NeonsRouterMiddleware();
