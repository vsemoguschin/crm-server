const Router = require('express');
const router = new Router();
const deliveriesRouterMiddleware = require('./deliveriesRouterMiddleware');
const deliveriesController = require('./deliveriesController');

router.post('/', deliveriesRouterMiddleware.create, deliveriesController.create);
router.get('/:id', deliveriesRouterMiddleware.getOne, deliveriesController.getOne);
router.get('/', deliveriesRouterMiddleware.getList, deliveriesController.getList);
router.put('/:id', deliveriesRouterMiddleware.update, deliveriesController.update);
router.delete('/:id', deliveriesRouterMiddleware.delete, deliveriesController.delete);

module.exports = router;