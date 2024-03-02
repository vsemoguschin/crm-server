const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: paymentsModelFields, Payment } = require('./paymentsModel');
const { Op } = require('sequelize');

const frontOptions = {
  modelFields: modelsService.getModelFields(paymentsModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class PaymentsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const newPayment = await modelsService.checkFields([Payment, paymentsModelFields], req.body);
      req.newPayment = newPayment;
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
      const payment = await Payment.findOne({
        where: {
          id,
        },
      });
      if (!payment) {
        throw ApiError.NotFound('Платеж не найден');
      }
      req.payment = payment;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const searchFields = ['title', 'method', 'date'];

    try {
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
        },
      };
      if (req.baseUrl.includes('/deals')) {
        const { deal } = req;
        searchParams.where.dealId = deal.id;
      }
      req.searchParams = { ...searchParams, ...searchFilter };
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PaymentsRouterMiddleware();
