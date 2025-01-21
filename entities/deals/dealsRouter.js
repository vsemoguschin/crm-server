const Router = require('express');
const router = new Router();
const dealsRouterMiddleware = require('./dealsRouterMiddleware');
const { getDeal, getListOfDeals } = require('./dealsRouterMiddleware');
const dealsController = require('./dealsController');
const filesRouterMiddleware = require('../files/filesRouterMiddleware');
const filesController = require('../files/filesController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');
const preordersRouterMiddleware = require('../preorders/preordersRouterMiddleware');
const preordersController = require('../preorders/preordersController');
const deliveriesRouterMiddleware = require('../deliveries/deliveriesRouterMiddleware');
const deliveriesController = require('../deliveries/deliveriesController');
const dopsRouterMiddleware = require('../dops/dopsRouterMiddleware');
const dopsController = require('../dops/dopsController');
const paymentsRouterMiddleware = require('../payments/paymentsRouterMiddleware');
const paymentsController = require('../payments/paymentsController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const usersRouterMiddleware = require('../users/usersRouterMiddleware');

router.get('/datas', dealsController.getDatas);

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

// router.get('/workSpace', getDeal, dealsController.getFullList);
router.get('/:id', checkReqParamsIsNumber, getDeal, dealsController.getOne);
router.get('/', getListOfDeals, dealsController.getList);
router.patch('/:id', checkReqParamsIsNumber, getDeal, dealsController.update);
router.delete('/:id', checkReqParamsIsNumber, getDeal, dealsController.delete);

//получение, добавление, удаление участников сделки
router.get('/:id/dealers', checkReqParamsIsNumber, getDeal, dealsRouterMiddleware.getDealers);
router.patch('/:id/dealers/:userId', checkReqParamsIsNumber, getDeal, usersRouterMiddleware.getOne, dealsRouterMiddleware.addDealers);
router.delete('/:id/dealers/:userId', checkReqParamsIsNumber, getDeal, usersRouterMiddleware.getOne, dealsRouterMiddleware.deleteDealers);

//смена статуса
router.patch('/:id/status/:new_status', getDeal, dealsController.changeStatus);

//Создание преордера(карточка дизайна)
router.post('/:id/preorders', checkReqParamsIsNumber, getDeal, preordersRouterMiddleware.create, preordersController.create);
// router.get('/:id/preorders', checkReqParamsIsNumber, getDeal, preordersRouterMiddleware.getList, preordersController.getList);

//создание и получение заказов внутри сделки
router.post('/:id/orders', checkReqParamsIsNumber, getDeal, ordersRouterMiddleware.create, ordersController.create);
router.get('/:id/orders', checkReqParamsIsNumber, getDeal, ordersRouterMiddleware.getList, ordersController.getList);

//создание и получение доставок внутри сделки
router.post('/:id/deliveries', checkReqParamsIsNumber, getDeal, deliveriesRouterMiddleware.create, deliveriesController.create);
router.get('/:id/deliveries', checkReqParamsIsNumber, getDeal, deliveriesRouterMiddleware.getList, deliveriesController.getList);

//создание и получение допов внутри сделки
router.post('/:id/dops', checkReqParamsIsNumber, getDeal, dopsRouterMiddleware.create, dopsController.create);
router.get('/:id/dops', checkReqParamsIsNumber, getDeal, dopsRouterMiddleware.getList, dopsController.getList);

//создание и получение платежей внутри сделки
router.post('/:id/payments', checkReqParamsIsNumber, getDeal, paymentsRouterMiddleware.create, paymentsController.create);
router.get('/:id/payments', checkReqParamsIsNumber, getDeal, paymentsRouterMiddleware.getList, paymentsController.getList);

//создание и получение файлов внутри сделки
router.post('/:id/files', checkReqParamsIsNumber, getDeal, filesRouterMiddleware.dealsFiles, filesController.create);
router.get('/:id/files', checkReqParamsIsNumber, getDeal, filesRouterMiddleware.getList, filesController.getList);

module.exports = router;
