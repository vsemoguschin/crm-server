const ApiError = require('../../error/apiError');
const { Payment, User, Deal } = require('../association');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require("../../utils/clearEmptyFields");
class paymentsController {
    async create(req, res, next) {
        try {
            const { new_payment } = req;
            const deal = await Payment.create(new_payment);
            return res.json(deal);
        } catch (e) {
            next(e)
        }
    };
    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const payment = await Payment.findOne(
                {
                    where: { id },
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes:
                                ['id','fullName', 'role']
                        },
                        {
                            model: Deal,
                            as: 'deal',
                            attributes:
                                ['id','fullName', 'price']
                        }
                    ],
                });
            return res.json(payment);
        } catch (e) {
            next(e)
        }
    };
    async getList(req, res, next) {
        const { userId, dealId, method, pageNumber, size } = req.query;
        const { limit, offset } = getPagination(pageNumber, size);
        try {
            const filter = clearEmptyFields({ userId, dealId, method });
            console.log(filter);
            const payment = await Payment.findAll({
                where: filter,
                order: ["createdAt"],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes:
                            ['id','fullName', 'role']
                    },
                    {
                        model: Deal,
                        as: 'deal',
                        attributes:
                            ['id','title', 'price']
                    }
                ],
                limit,
                offset
            });
            console.log(payment);
            const resData = getPaginationData(payment, pageNumber, limit, 'deals')
            return res.json(resData);
        } catch (e) {
            next(e)
        }
    };
    async update(req, res) {
        
    };
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedPayment = await Payment.destroy({ where: id });
            if (deletedPayment === 0) {
              return res.json('Платеж не удален');
            }
            return res.json('Платеж удален');
          } catch (e) {
            next(e)
          }
        }
};

module.exports = new paymentsController();