const ApiError = require('../../error/apiError');
const { Deal, User, Client, Payment } = require('../association');
const fs = require('fs-extra');
const diskService = require('../../services/diskService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require("../../utils/clearEmptyFields");
class dealsController {
    async create(req, res, next) {
        try {
            const { new_deal } = req;
            const { preview } = new_deal;
            const { img } = req.files;
            const deal = await Deal.create(new_deal);
            const filePath = 'deals/' + preview;
            fs.writeFileSync('public/' + filePath, img.data, err => {
                if (err) {
                    throw ApiError.BadRequest('Wrong');
                };
            });
            return res.json(deal);
        } catch (e) {
            next(e)
        }
    };
    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            //полная инфа по сделкам
            const deal = await Deal.findOne(
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
                            model: Client,
                            as: 'client',
                            attributes:
                                ['id','fullName']
                        },
                        {
                            association: 'payments',
                            attributes:
                                ['id','name']
                        },
                        {
                            association: 'order',
                            attributes:
                                ['id','name']
                        },
                        {
                            association: 'dops',
                            attributes:
                                ['id','name']
                        }
                    ],
                });
            return res.json(deal);
        } catch (e) {
            next(e)
        }
    };
    async getList(req, res, next) {
        const { userId, clientId, pageNumber, size } = req.query;
        const { limit, offset } = getPagination(pageNumber, size);
        try {
            const filter = clearEmptyFields({ userId, clientId });
            //по периодам(месяц, день, неделя , ...) может есть у sequelize
            // сделки юзеров и их юзеров
            //т.е. найти всех юзеров включая их сделки
            // console.log(filter);
            const deals = await Deal.findAndCountAll({
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
                        model: Client,
                        as: 'client',
                        attributes:
                            ['id','fullName']
                    }
                ],
                limit,
                offset
            });
            console.log(deals.rows[0].dataValues);
            const resData = getPaginationData(deals, pageNumber, limit, 'deals');
            console.log(resData);
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

module.exports = new dealsController();