const Router = require('express');
const router = new Router;
const clientsRouterMiddleware = require('./clientsRouterMiddleware');
const clientsController = require('./clientsController');

router.post('/', clientsRouterMiddleware.create, clientsController.create);
router.get('/:id', clientsRouterMiddleware.getOne, clientsController.getOne);
router.get('/', clientsRouterMiddleware.getList, clientsController.getList);
router.put('/:id', clientsRouterMiddleware.update, clientsController.update);
router.delete('/:id', clientsRouterMiddleware.delete, clientsController.delete);

module.exports = router;