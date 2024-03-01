const Router = require('express');
const router = new Router();
const usersRouterMiddleware = require('./usersRouterMiddleware');
const usersController = require('./usersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const clientsController = require('../clients/clientsController');
const clientsRouterMiddleware = require('../clients/clientsRouterMiddleware');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');
const dopsRouterMiddleware = require('../dops/dopsRouterMiddleware');
const dopsController = require('../dops/dopsController');

router.post('/', usersRouterMiddleware.create, usersController.create);
router.get('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersController.getOne);
router.get('/', usersRouterMiddleware.getList, usersController.getList);
router.patch('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersRouterMiddleware.update, usersController.update);
router.delete('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersRouterMiddleware.delete, usersController.delete);

router.get('/:id/clients', checkReqParamsIsNumber, usersRouterMiddleware.getOne, clientsRouterMiddleware.getList, clientsController.getList);
router.get('/:id/deals', checkReqParamsIsNumber, usersRouterMiddleware.getOne, dealsRouterMiddleware.getList, dealsController.getList);
router.get('/:id/orders', checkReqParamsIsNumber, usersRouterMiddleware.getOne, ordersRouterMiddleware.getList, ordersController.getList);
router.get('/:id/dops', checkReqParamsIsNumber, usersRouterMiddleware.getOne, dopsRouterMiddleware.getList, dopsController.getList);
router.get('/:id/work', checkReqParamsIsNumber, usersRouterMiddleware.getOne, ordersRouterMiddleware.getList, ordersController.getList);

module.exports = router;
