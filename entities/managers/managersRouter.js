const Router = require('express');
const router = new Router();
const managersRouterMiddleware = require('./managersRouterMiddleware');
const managersController = require('./managersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const ApiError = require('../../error/apiError');

router.get('/', managersRouterMiddleware.getList, managersController.getList);
router.get('/:id', checkReqParamsIsNumber, managersRouterMiddleware.getOne, managersController.getOne);

router.post('/:id/plan', checkReqParamsIsNumber, managersRouterMiddleware.getOne, managersController.setPlan);

module.exports = router;
