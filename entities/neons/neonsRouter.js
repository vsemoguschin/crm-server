const Router = require('express');
const router = new Router();
const neonsRouterMiddleware = require('./neonsRouterMiddleware');
const neonsController = require('./neonsController');

// router.post('/', neonsRouterMiddleware.create, neonsController.create);
// router.get('/:id', neonsRouterMiddleware.getOne, neonsController.getOne);
router.get('/', neonsRouterMiddleware.getList, neonsController.getList);
router.patch('/:id', neonsRouterMiddleware.getOne, neonsController.update);
router.delete('/:id', neonsRouterMiddleware.getOne, neonsController.delete);

module.exports = router;
