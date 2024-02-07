const Router = require('express');
const router = new Router();
const deliveriesRouterMiddleware = require('./deliveriesRouterMiddleware');
const deliveriesController = require('./deliveriesController');
const ordersController = require('../orders/ordersController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');

// router.post('/', deliveriesRouterMiddleware.create, deliveriesController.create);// создание только внутри сделки
router.get('/:id', deliveriesRouterMiddleware.getOne, deliveriesController.getOne);
router.get('/', deliveriesRouterMiddleware.getList, deliveriesController.getList);
router.put('/:id', deliveriesRouterMiddleware.update, deliveriesController.update);
router.delete('/:id', deliveriesRouterMiddleware.delete, deliveriesController.delete);

//добавление заказов в доставку
router.post('/:id/orders', deliveriesRouterMiddleware.addOrders, ordersController.update);
router.get('/:id/orders', ordersRouterMiddleware.getList, ordersController.getList);

module.exports = router;
