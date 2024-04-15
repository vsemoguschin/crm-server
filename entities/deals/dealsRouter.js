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
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const usersRouterMiddleware = require('../users/usersRouterMiddleware');

router.get('/methods', dealsController.getMethods);
router.post('/methods', dealsController.createMethods);
router.delete('/methods/:methodId', checkReqParamsIsNumber, dealsController.deleteMethods);

//список сфер деятельности
router.get('/spheres', dealsController.getSpheres);
router.post('/spheres', dealsController.createSpheres);
router.delete('/spheres/:sphereId', checkReqParamsIsNumber, dealsController.deleteSpheres);

//список рекламных тегов
router.get('/tags', dealsController.getAdTags);
router.post('/tags', dealsController.createAdTags);
router.delete('/tags/:tagId', checkReqParamsIsNumber, dealsController.deleteAdTags);

// router.get('/workSpace', dealsRouterMiddleware.getList, dealsController.getFullList);
router.get('/:id', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, dealsController.getOne);
router.get('/', dealsRouterMiddleware.getList, dealsController.getList);
router.patch('/:id', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, dealsController.update);
router.delete('/:id', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, dealsController.delete);

//получение, добавление, удаление участников сделки
router.get('/:id/dealers', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, dealsRouterMiddleware.getDealers);
router.patch(
  '/:id/dealers/:userId',
  checkReqParamsIsNumber,
  dealsRouterMiddleware.getOne,
  usersRouterMiddleware.getOne,
  dealsRouterMiddleware.addDealers,
);
router.delete(
  '/:id/dealers/:userId',
  checkReqParamsIsNumber,
  dealsRouterMiddleware.getOne,
  usersRouterMiddleware.getOne,
  dealsRouterMiddleware.deleteDealers,
);

//смена статуса
router.patch('/:id/status/:new_status', dealsRouterMiddleware.getOne, dealsController.changeStatus);

//создание и получение заказов внутри сделки
router.post('/:id/orders', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, ordersRouterMiddleware.create, ordersController.create);
router.get('/:id/orders', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, ordersRouterMiddleware.getList, ordersController.getList);

//создание и получение доставок внутри сделки
router.post('/:id/deliveries', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, deliveriesRouterMiddleware.create, deliveriesController.create);
router.get('/:id/deliveries', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, deliveriesRouterMiddleware.getList, deliveriesController.getList);

//создание и получение допов внутри сделки
router.post('/:id/dops', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, dopsRouterMiddleware.create, dopsController.create);
router.get('/:id/dops', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, dopsRouterMiddleware.getList, dopsController.getList);

//создание и получение платежей внутри сделки
router.post('/:id/payments', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, paymentsRouterMiddleware.create, paymentsController.create);
router.get('/:id/payments', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, paymentsRouterMiddleware.getList, paymentsController.getList);

//создание и получение файлов внутри сделки
router.post('/:id/files', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, filesRouterMiddleware.dealsFiles, filesController.create);
router.get('/:id/files', checkReqParamsIsNumber, dealsRouterMiddleware.getOne, filesRouterMiddleware.getList, filesController.getList);

module.exports = router;
