const Router = require('express');
const router = new Router();
const workSpacesRouterMiddleware = require('./workSpacesRouterMiddleware');
const workSpacesController = require('./workSpacesController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const clientsRouterMiddleware = require('../clients/clientsRouterMiddleware');
const clientsController = require('../clients/clientsController');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');
const deliveriesRouterMiddleware = require('../deliveries/deliveriesRouterMiddleware');

router.post('/', workSpacesRouterMiddleware.create, workSpacesController.create);
router.get('/', workSpacesRouterMiddleware.getList, workSpacesController.getList);
router.patch('/:id', checkReqParamsIsNumber, workSpacesRouterMiddleware.update, workSpacesController.update);
// router.delete('/:id', checkReqParamsIsNumber, workSpacesRouterMiddleware.delete, workSpacesController.delete);

//добавление и получение пользователей внутри workSpace
router.put('/:id/users/:userId', checkReqParamsIsNumber, workSpacesRouterMiddleware.addUsers);
router.get('/:id/users', checkReqParamsIsNumber, workSpacesRouterMiddleware.getUsers);
router.delete('/:id/users/:userId', checkReqParamsIsNumber, workSpacesRouterMiddleware.deleteUsers);

//создание и получение клиентов в воркспейсе
router.post('/:id/clients/', checkReqParamsIsNumber, clientsRouterMiddleware.create, clientsController.create);
router.get('/:id/clients/', checkReqParamsIsNumber, clientsRouterMiddleware.getList, clientsController.getList);

//получение сделок воркспейса для коммерческого отдела
router.get('/:id/deals', checkReqParamsIsNumber, dealsRouterMiddleware.getList, dealsController.commercialList);

//добавление и получение заказов внутри workSpace
router.put('/:id/orders/:orderId', checkReqParamsIsNumber, workSpacesRouterMiddleware.addOrders, ordersController.update);

router.get('/:id', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, workSpacesController.getOne);
router.get('/:id/stage/:stageId', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, ordersController.getList);

//отправки workSpace
router.get('/:id/deliveries', checkReqParamsIsNumber, deliveriesRouterMiddleware.getList, dealsController.getList);

module.exports = router;
