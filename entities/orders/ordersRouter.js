const Router = require('express');
const router = new Router();
const ordersRouterMiddleware = require('./ordersRouterMiddleware');
const ordersController = require('./ordersController');
const neonsController = require('../neons/neonsController');
const neonsRouterMiddleware = require('../neons/neonsRouterMiddleware');
const filesRouterMiddleware = require('../files/filesRouterMiddleware');
const filesController = require('../files/filesController');

router.post('/', ordersRouterMiddleware.create, ordersController.create);
router.get('/:id', ordersRouterMiddleware.getOne, ordersController.getOne);
router.get('/', ordersRouterMiddleware.getList, ordersController.getList);
router.put('/:id', ordersRouterMiddleware.update, ordersController.update);
router.delete('/:id', ordersRouterMiddleware.delete, ordersController.delete);

router.post('/:id/neons',neonsRouterMiddleware.create, neonsController.create)
router.delete('/:id/neons', neonsRouterMiddleware.delete, neonsController.delete)

router.post('/:id/files', filesRouterMiddleware.ordersImgs, filesController.create);

module.exports = router;