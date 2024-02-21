const Router = require('express');
const router = new Router();
const ordersRouterMiddleware = require('./ordersRouterMiddleware');
const ordersController = require('./ordersController');
const neonsController = require('../neons/neonsController');
const neonsRouterMiddleware = require('../neons/neonsRouterMiddleware');
const filesRouterMiddleware = require('../files/filesRouterMiddleware');
const filesController = require('../files/filesController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

// router.post('/', ordersRouterMiddleware.create, ordersController.create); //создание заказа только внутри сделки
router.get('/:id', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.getOne);
router.get('/', ordersRouterMiddleware.getList, ordersController.getList);
router.patch('/:id', checkReqParamsIsNumber, ordersRouterMiddleware.update, ordersController.update);
router.delete('/:id', checkReqParamsIsNumber, ordersRouterMiddleware.delete, ordersController.delete);

router.post('/:id/neons', checkReqParamsIsNumber, neonsRouterMiddleware.create, neonsController.create);
router.get('/:id/neons', checkReqParamsIsNumber, neonsRouterMiddleware.getList, neonsController.getList);
router.delete('/:id/neons', checkReqParamsIsNumber, neonsRouterMiddleware.delete, neonsController.delete);

router.put('/:id/files', checkReqParamsIsNumber, filesRouterMiddleware.ordersImgs, filesController.create);
router.get('/:id/files', checkReqParamsIsNumber, filesRouterMiddleware.getList, filesController.getList);

//перемещение заказа по стадиям
router.patch('/:id/stage/:stageId', checkReqParamsIsNumber, ordersRouterMiddleware.changeStage, ordersController.update);
//добавление и удаление исполнителей из заказа
router.put('/:id/executors/:userId', checkReqParamsIsNumber, ordersRouterMiddleware.setExecutor, ordersController.update);
router.delete('/:id/executors/:userId', checkReqParamsIsNumber, ordersRouterMiddleware.removeExecutor, ordersController.update);

module.exports = router;
