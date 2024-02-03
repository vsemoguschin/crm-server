const { Payment, modelFields: paymentsModelFields } = require('./paymentsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Op } = require("sequelize");

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
      next(e)
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
      return res.json(payment);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key,//?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);

      let isDeal = false;
      if (req.params.id && !isNaN(+req.params.id)) {
        isDeal = req.params.id
      }
      const payments = await Payment.findAndCountAll({
        where: {
          ...filter,
          dealId: isDeal || { [Op.gt]: 0 }
        },
        order,
        limit,
        offset,
        // include: 'payments',
      });
      const response = getPaginationData(
        payments,
        pageNumber,
        pageSize,
        "payments"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(paymentsModelFields, req.body, req.updateFields);

      const [updated, payment] = await Payment.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(payment)
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {
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
      next(e)
    }
  }
}

module.exports = new PaymentsController();
