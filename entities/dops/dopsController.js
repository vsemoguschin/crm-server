const ApiError = require('../../error/apiError');
const Dop = require('./dopsModel');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require("../../utils/clearEmptyFields");
class dopsController {
    async create(req, res, next) {
        try {
            const { new_dop } = req;
            const dop = await Dop.create(new_dop);
            return res.json(dop);
        } catch (e) {
            next(e)
        }
    };
    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const dop = await Dop.findOne({ where: { id } });
            return res.json(dop);
        } catch (e) {
            next(e)
        }
    };
    async getList(req, res, next) {
        const { userId, dealId, pageNumber, size } = req.query;
        const { limit, offset } = getPagination(pageNumber, size);
        try {
            const filter = clearEmptyFields({ userId, dealId });
            console.log(filter);
            const dops = await Dop.findAll({
                where: filter,
                order: ["createdAt"],
                limit,
                offset
            });
            console.log(dops);
            const resData = getPaginationData(dops, pageNumber, limit, 'dops')
            return res.json(resData);
        } catch (e) {
            next(e)
        }
    };
    async update(req, res) {
        
    };
    async delete(req, res) {

    }

};

module.exports = new dopsController();