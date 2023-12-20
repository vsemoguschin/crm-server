const ApiError = require('../../error/apiError');
const dopsPermissions = require('./dopsPermissions');

class DopsRouterMiddleware {
    create(req, res, next) { //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
        const requester = req.user.role;
        const requesterID = req.user.id;
        const { name, price, description, dealId } = req.body;
        const availableDopsType = ['present', 'plenka','...'];
        try {
            if (!name || !price || !description || !dealId) {
                throw ApiError.BadRequest('Забыл что то указать');
            };
            if (price && isNaN(price)) {
                throw ApiError.BadRequest("Не верное price")
            };
            const permission = dopsPermissions.check(requester);
            if (!permission) {
                throw ApiError.Forbidden("Нет доступа")
            };
            req.new_dop = {
                name, 
                price, 
                description, 
                dealId,
                userId: requesterID
            }
            next();
        } catch (e) {
            next(e)
        }
    };
    getOne(req, res, next) {
        const requester = req.user.role;
        try {
            const permission = dopsPermissions.check(requester);
            if (!permission) {
                throw ApiError.Forbidden("Нет доступа");
            };
            next()
        } catch (e) {
            next(e)
        }
    }
    getList(req, res, next) {
        try {
            const { userId, dealId, method } = req.query;
            const requester = req.user.role;
            const permission = dopsPermissions.check(requester);
            if (!permission) {
                throw ApiError.Forbidden("Нет доступа");
            };
            if (userId && isNaN(userId)) {
                throw ApiError.BadRequest("Не верное userId")
            };
            if (dealId && isNaN(dealId)) {
                throw ApiError.BadRequest("Не верное dealId")
            };
            next()
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new DopsRouterMiddleware;