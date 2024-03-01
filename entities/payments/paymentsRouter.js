const Router = require('express');
const router = new Router();
const paymentsRouterMiddleware = require('./paymentsRouterMiddleware');
const paymentsController = require('./paymentsController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

// router.post('/', paymentsRouterMiddleware.create, paymentsController.create);//создание только внутри сделки
router.get('/:id', checkReqParamsIsNumber, paymentsRouterMiddleware.getOne, paymentsController.getOne);
router.get('/', paymentsRouterMiddleware.getList, paymentsController.getList);
router.patch('/:id', checkReqParamsIsNumber, paymentsRouterMiddleware.getOne, paymentsController.update);
router.delete('/:id', checkReqParamsIsNumber, paymentsRouterMiddleware.getOne, paymentsController.delete);

module.exports = router;
