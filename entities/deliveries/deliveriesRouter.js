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
router.patch('/:id', checkReqParamsIsNumber, deliveriesRouterMiddleware.getOne, deliveriesController.update);
router.delete('/:id', checkReqParamsIsNumber, deliveriesRouterMiddleware.getOne, deliveriesController.delete);

//добавление заказов в доставку
router.patch(
  '/:id/orders/:orderId',
  checkReqParamsIsNumber,
  deliveriesRouterMiddleware.getOne,
  ordersRouterMiddleware.getOne,
  deliveriesRouterMiddleware.addOrders,
);
router.delete(
  '/:id/orders/:orderId',
  checkReqParamsIsNumber,
  deliveriesRouterMiddleware.getOne,
  ordersRouterMiddleware.getOne,
  deliveriesRouterMiddleware.deleteOrders,
);
router.get('/:id/orders', checkReqParamsIsNumber, deliveriesRouterMiddleware.getOne, ordersRouterMiddleware.getList, ordersController.getList);

module.exports = router;
