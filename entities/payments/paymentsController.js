const { Payment, modelFields: paymentsModelFields } = require('./paymentsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const planService = require('../../services/planService');

class PaymentsController {
  async create(req, res, next) {
    try {
      const { deal, newPayment } = req;
      newPayment.userId = req.requester.id;
      const payment = await deal.createPayment(newPayment);
      await planService.createPayment(payment, deal.createdAt);
      return res.json(payment);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { payment } = req;

      return res.json(payment);
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

      const payments = await Payment.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(payments, current, pageSize, 'payments');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const updateFields = ['title', 'price', 'date', 'method', 'description'];

    try {
      const { payment } = req;
      const body = checkRepeatedValues(payment, req.body);
      const updates = await modelsService.checkUpdates([Payment, paymentsModelFields], body, updateFields);

      await payment.update(updates);
      return res.json(payment);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { payment } = req;
      const deletedPayment = await payment.destroy();
      // console.log(deletedPayment);
      if (deletedPayment === 0) {
        console.log('Платеж не удален');
        return res.json('Платеж не удален');
      }
      await planService.deletePayment(payment);
      console.log('Платеж удален');
      return res.json('Платеж удален');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PaymentsController();
