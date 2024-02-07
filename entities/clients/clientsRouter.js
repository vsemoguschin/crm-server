const Router = require('express');
const router = new Router();
const clientsRouterMiddleware = require('./clientsRouterMiddleware');
const clientsController = require('./clientsController');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');

router.post('/', clientsRouterMiddleware.create, clientsController.create);
router.get('/:id', clientsRouterMiddleware.getOne, clientsController.getOne);
router.get('/', clientsRouterMiddleware.getList, clientsController.getList);
router.put('/:id', clientsRouterMiddleware.update, clientsController.update);
router.delete('/:id', clientsRouterMiddleware.delete, clientsController.delete);

//создание и получение заказов внутри сделки
router.post('/:id/deals', dealsRouterMiddleware.create, dealsController.create);
router.get('/:id/deals', dealsRouterMiddleware.getList, dealsController.getList);

module.exports = router;
