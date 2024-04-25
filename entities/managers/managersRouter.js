const Router = require('express');
const router = new Router();
const managersRouterMiddleware = require('./managersRouterMiddleware');
const managersController = require('./managersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

router.get('/', managersRouterMiddleware.getList, managersController.getList);
router.get('/:id', checkReqParamsIsNumber, managersRouterMiddleware.getOne, managersController.getOne);

router.post('/:id/plan', checkReqParamsIsNumber, managersRouterMiddleware.getOne, managersController.setPlan);
router.post('/plan', managersController.setMainPlan);

module.exports = router;
