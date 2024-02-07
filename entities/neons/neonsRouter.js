const Router = require('express');
const router = new Router();
const neonsRouterMiddleware = require('./neonsRouterMiddleware');
const neonsController = require('./neonsController');

// router.post('/', neonsRouterMiddleware.create, neonsController.create);
// router.get('/:id', neonsRouterMiddleware.getOne, neonsController.getOne);
// router.get('/', neonsRouterMiddleware.getList, neonsController.getList);
router.put('/:id', neonsRouterMiddleware.update, neonsController.update);
router.delete('/:id', neonsRouterMiddleware.delete, neonsController.delete);

module.exports = router;
