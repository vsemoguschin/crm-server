const Router = require('express');
const router = new Router();
const workSpacesRouterMiddleware = require('./workSpacesRouterMiddleware');
const workSpacesController = require('./workSpacesController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');

router.post('/', workSpacesRouterMiddleware.create, workSpacesController.create);
router.get('/:id', workSpacesRouterMiddleware.getOne, workSpacesController.getOne);
router.get('/', workSpacesRouterMiddleware.getList, workSpacesController.getList);
router.put('/:id', workSpacesRouterMiddleware.update, workSpacesController.update);
router.delete('/:id', workSpacesRouterMiddleware.delete, workSpacesController.delete);

//добавление и получение заказов внутри workspace
router.post('/:id/orders', workSpacesRouterMiddleware.addOrders, ordersController.update);
router.get('/:id/orders', ordersRouterMiddleware.getList, ordersController.getList);

//добавление и получение пользователей внутри workspace
// router.post('/:id/users', ordersRouterMiddleware.update, ordersController.update);
// router.get('/:id/users', ordersRouterMiddleware.getList, ordersController.getList);

//отправки workspace
router.get('/:id/users', ordersRouterMiddleware.getList, ordersController.getList);

module.exports = router;
