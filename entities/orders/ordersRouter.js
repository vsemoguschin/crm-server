const Router = require('express');
const router = new Router();
const ordersRouterMiddleware = require('./ordersRouterMiddleware');
const ordersController = require('./ordersController');
const neonsController = require('../neons/neonsController');
const neonsRouterMiddleware = require('../neons/neonsRouterMiddleware');
const filesRouterMiddleware = require('../files/filesRouterMiddleware');
const filesController = require('../files/filesController');

// router.post('/', ordersRouterMiddleware.create, ordersController.create); //создание заказа только внутри сделки
router.get('/:id', ordersRouterMiddleware.getOne, ordersController.getOne);
router.get('/', ordersRouterMiddleware.getList, ordersController.getList);
router.put('/:id', ordersRouterMiddleware.update, ordersController.update);
router.delete('/:id', ordersRouterMiddleware.delete, ordersController.delete);

router.post('/:id/neons', neonsRouterMiddleware.create, neonsController.create);
router.get('/:id/neons', neonsRouterMiddleware.getList, neonsController.getList);
router.delete('/:id/neons', neonsRouterMiddleware.delete, neonsController.delete);

router.post('/:id/files', filesRouterMiddleware.ordersImgs, filesController.create);
router.get('/:id/files', filesRouterMiddleware.getList, filesController.getList);

//перемещение заказа по стадиям
router.put('/:id/stage/:stageId', ordersRouterMiddleware.changeStage, ordersController.update);

module.exports = router;
