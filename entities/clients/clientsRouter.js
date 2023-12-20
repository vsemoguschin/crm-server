const Router = require('express');
const router = new Router;
const clientsRouterMiddleware = require('./clientsRouterMiddleware');
const clientsController = require('./clientsController');

router.post('/', clientsRouterMiddleware.create, clientsController.create);
router.get('/:id', clientsController.getOne);
router.get('/', clientsRouterMiddleware.getList, clientsController.getList);
router.put('/:id', clientsController.update);
router.delete('/:id', clientsController.delete);


module.exports = router;