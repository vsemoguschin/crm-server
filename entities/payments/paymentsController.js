const { Payment, modelFields: paymentsModelFields } = require('./paymentsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Op } = require('sequelize');

class PaymentsController {
  async create(req, res, next) {
    try {
      const { newPayment } = req;
      const payment = await Payment.create({
        ...newPayment,
        userId: req.user.id,
        dealId: req.params.id,
      });
      return res.json(payment);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({
        where: {
          id,
        },
      });
      if (!payment) {
        return res.status(404).json('payment not found');
      }
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
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);

      let modelSearch = {
        id: { [Op.gt]: 0 },
      };
      if (req.baseUrl.includes('/deals')) {
        modelSearch = { dealId: +req.params.id };
      }
      const payments = await Payment.findAndCountAll({
        where: {
          ...filter,
          ...modelSearch,
        },
        order,
        limit,
        offset,
      });
      const response = getPaginationData(payments, current, pageSize, 'payments');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(paymentsModelFields, req.body, req.updateFields);

      const [, payment] = await Payment.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(payment);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedPayment = await Payment.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedPayment);
      if (deletedPayment === 0) {
        console.log('Платеж не удален');
        return res.json('Платеж не удален');
      }
      console.log('Платеж удален');
      return res.json('Платеж удален');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PaymentsController();
