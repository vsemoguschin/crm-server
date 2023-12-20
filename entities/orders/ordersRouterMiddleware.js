const ApiError = require('../../error/apiError');
const ordersPermissions = require('./ordersPermissions');
const OrderDto = require('./ordersDto');
const uuid = require('uuid');
const checkImgFormat = require('../../checking/checkImgFormat');

class OrdersRouterMiddleware {
    create(req, res, next) { //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
        const requester = req.user.role;
        const { img } = req.files;
        try {
            const permission = ordersPermissions.toCreate(requester);
            if (!permission) {
                throw ApiError.Forbidden("Нет доступа")
            };
            const taskDatas = OrderDto({ ...req.body }).check();
            if (!taskDatas || req?.files && !req?.files?.img) {
                throw ApiError.BadRequest('Забыл что то указать');
            };
            const imgFormat = checkImgFormat(img.name);
            if (!imgFormat) {
                throw ApiError.BadRequest("Не верный формат изображения")
            };
            let preview = uuid.v4() + imgFormat;
            req.new_task = {
                ...taskDatas,
                preview,
                userId: req.user.id,
                stageId: 1,
            }
            next();
        } catch (e) {
            next(e)
        }
    }
    getOne(req, res, next) {
        const requester = req.user.role;
        console.log(req.params);
        try {
            const permission = ordersPermissions.toWatch(requester);
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
            const { userId, clientId } = req.query;
            const requester = req.user.role;
            const permission = ordersPermissions.toWatch(requester);
            if (!permission) {
                throw ApiError.Forbidden("Нет доступа");
            };
            if (userId && isNaN(userId)) {
                throw ApiError.BadRequest("Не верное userId")
            };
            if (clientId && isNaN(clientId)) {
                throw ApiError.BadRequest("Не верное clientId")
            };
            next()
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new OrdersRouterMiddleware;