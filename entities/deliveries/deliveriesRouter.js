const Router = require('express');
const router = new Router();
const deliveriesRouterMiddleware = require('./deliveriesRouterMiddleware');
const deliveriesController = require('./deliveriesController');
const ordersController = require('../orders/ordersController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

// router.post('/', deliveriesRouterMiddleware.create, deliveriesController.create);// создание только внутри сделки
router.get('/:id', checkReqParamsIsNumber, deliveriesRouterMiddleware.getOne, deliveriesController.getOne);
router.get('/', deliveriesRouterMiddleware.getList, deliveriesController.getList);
router.put('/:id', checkReqParamsIsNumber, deliveriesRouterMiddleware.update, deliveriesController.update);
router.delete('/:id', checkReqParamsIsNumber, deliveriesRouterMiddleware.delete, deliveriesController.delete);

//добавление заказов в доставку
router.put('/:id/orders/:orderId', checkReqParamsIsNumber, deliveriesRouterMiddleware.addOrders, ordersController.update);
router.delete('/:id/orders/:orderId', checkReqParamsIsNumber, deliveriesRouterMiddleware.deleteOrders, ordersController.update);
router.get('/:id/orders', checkReqParamsIsNumber, ordersRouterMiddleware.getList, ordersController.getList);

module.exports = router;
