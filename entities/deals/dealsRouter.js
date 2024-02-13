const Router = require('express');
const router = new Router();
const dealsRouterMiddleware = require('./dealsRouterMiddleware');
const dealsController = require('./dealsController');
const filesRouterMiddleware = require('../files/filesRouterMiddleware');
const filesController = require('../files/filesController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');
const deliveriesRouterMiddleware = require('../deliveries/deliveriesRouterMiddleware');
const deliveriesController = require('../deliveries/deliveriesController');
const dopsRouterMiddleware = require('../dops/dopsRouterMiddleware');
const dopsController = require('../dops/dopsController');
const paymentsRouterMiddleware = require('../payments/paymentsRouterMiddleware');
const paymentsController = require('../payments/paymentsController');

router.post('/', dealsRouterMiddleware.create, dealsController.create); //создание только внутри клиента
router.get('/workspace', dealsRouterMiddleware.getList, dealsController.getFullList);
router.get('/:id', dealsRouterMiddleware.getOne, dealsController.getOne);
router.get('/', dealsRouterMiddleware.getList, dealsController.getList);
router.put('/:id', dealsRouterMiddleware.update, dealsController.update);
router.delete('/:id', dealsRouterMiddleware.delete, dealsController.delete);

//создание и получение заказов внутри сделки
router.post('/:id/orders', ordersRouterMiddleware.create, ordersController.create);
router.get('/:id/orders', ordersRouterMiddleware.getList, ordersController.getList);

//создание и получение доставок внутри сделки
router.post('/:id/deliveries', deliveriesRouterMiddleware.create, deliveriesController.create);
router.get('/:id/deliveries', deliveriesRouterMiddleware.getList, deliveriesController.getList);

//создание и получение доставок внутри сделки
router.post('/:id/dops', dopsRouterMiddleware.create, dopsController.create);
router.get('/:id/dops', dopsRouterMiddleware.getList, dopsController.getList);

//создание и получение платежей внутри сделки
router.post('/:id/payments', paymentsRouterMiddleware.create, paymentsController.create);
router.get('/:id/payments', paymentsRouterMiddleware.getList, paymentsController.getList);

//создание и получение файлов внутри сделки
router.post('/:id/files', filesRouterMiddleware.dealsFiles, filesController.create);
router.get('/:id/files', filesRouterMiddleware.getList, filesController.getList);

module.exports = router;
