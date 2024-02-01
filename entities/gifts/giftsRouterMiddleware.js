const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { Order, modelFields: ordersModelFields } = require('./ordersModel');
const { Deal } = require('../association');

const frontOptions = {
  modelFields: modelsService.getModelFields(ordersModelFields),
};
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['name', 'description', 'material', 'elements', 'boardHeight',
  'boardWidth', 'wireLength', 'dimer', 'acrylic', 'print', 'laminate', 'adapter', 'plug',
  'holeType', 'fittings'];
const searchFields = ['name'];

class OrdersRouterMiddleware {
    async create(req, res, next) {
        //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
        try {
            const requester = req.user.role;
            //проверка на доступ к созданию
            if (!permissions.includes(requester)) {
                console.log(false, 'no acces');
                throw ApiError.Forbidden('Нет доступа');
            };
            //проверка значения и наличия сделки
            if (!req.body.dealId || isNaN(+req.body.dealId)) {
                console.log(false, 'Забыл что то указать');
                throw ApiError.BadRequest('Забыл что то указать');
            }
            const deal = await Deal.findOne({
                where: { id: req.body.dealId }
            });
            if (!deal) {
                console.log(false, 'No deal');
                throw ApiError.BadRequest('No deal');
            }
            const newOrder = await modelsService.checkFields(ordersModelFields, req.body);
            req.newOrder = newOrder;
            next();
        } catch (e) {
            next(e);
        }
    }
    async getOne(req, res, next) {
        try {
            const requester = req.user.role;
            if (!permissions.includes(requester)
            && !['DP', 'RP', 'FRZ', 'MASTER', 'PACKER'].includes(requester)) {
                return console.log(false, 'no acces');
            };
            next();
        } catch (e) {
            next(e);
        }
    }
    async getList(req, res, next) {
        try {
            const requester = req.user.role;
            if (!permissions.includes(requester)
            && !['DP', 'RP', 'FRZ', 'MASTER', 'PACKER'].includes(requester)) {
                return console.log(false, 'no acces');
            }
            req.searchFields = searchFields;
            next();
        } catch (e) {
            next(e);
        }
    }
    async update(req, res, next) {
        try {
            const requester = req.user.role;
            if (!permissions.includes(requester)) {
                console.log(false, 'no acces');
                throw ApiError.Forbidden('Нет доступа');
            }
            req.updates = await modelsService.checkUpdates(ordersModelFields, req.body, updateFields);;
  
            next()
        } catch (e) {
            next(e)
        }
    }
    async delete(req, res, next) {
        try {
            const requester = req.user.role;
            if (!permissions.includes(requester)) {
                console.log(false, 'no acces');
                throw ApiError.Forbidden('Нет доступа');
            }
            next()
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new OrdersRouterMiddleware;