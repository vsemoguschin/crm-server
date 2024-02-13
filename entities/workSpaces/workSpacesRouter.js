const Router = require('express');
const router = new Router();
const workSpacesRouterMiddleware = require('./workSpacesRouterMiddleware');
const workSpacesController = require('./workSpacesController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');
const usersController = require('../users/usersController');

router.post('/', workSpacesRouterMiddleware.create, workSpacesController.create);
router.get('/:id', workSpacesRouterMiddleware.getOne, workSpacesController.getOne);
router.get('/', workSpacesRouterMiddleware.getList, workSpacesController.getList);
router.put('/:id', workSpacesRouterMiddleware.update, workSpacesController.update);
router.delete('/:id', workSpacesRouterMiddleware.delete, workSpacesController.delete);

//добавление и получение заказов внутри workspace
router.post('/:id/orders', workSpacesRouterMiddleware.addOrders, ordersController.update);
router.get('/:id/orders', ordersRouterMiddleware.getList, ordersController.getList); //получение всех заказов воркспейса

//добавление и получение пользователей внутри workspace
router.post('/:id/users/:userId', workSpacesRouterMiddleware.addUsers);
// router.delete('/:id/users', workSpacesRouterMiddleware.deleteUsers);
router.get('/:id/users', workSpacesRouterMiddleware.getUsers, usersController.getList);

//отправки workspace
// router.get('/:id/users', ordersRouterMiddleware.getList, ordersController.getList);

module.exports = router;
