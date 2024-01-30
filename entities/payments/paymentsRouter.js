const Router = require('express');
const router = new Router();
const paymentsRouterMiddleware = require('./paymentsRouterMiddleware');
const paymentsController = require('./paymentsController');

router.post('/', paymentsRouterMiddleware.create, paymentsController.create);
router.get('/:id', paymentsRouterMiddleware.getOne, paymentsController.getOne);
router.get('/', paymentsRouterMiddleware.getList, paymentsController.getList);
router.put('/:id', paymentsRouterMiddleware.update, paymentsController.update);
router.delete('/:id', paymentsRouterMiddleware.delete, paymentsController.delete);

module.exports = router;