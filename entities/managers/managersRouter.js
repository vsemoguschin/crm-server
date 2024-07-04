const Router = require('express');
const router = new Router();
const managersRouterMiddleware = require('./managersRouterMiddleware');
const managersController = require('./managersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');

router.get('/', managersRouterMiddleware.getList, managersController.getList);
// router.get('/plans', checkReqParamsIsNumber, managersRouterMiddleware.getManagersPlans, managersController.getManagersPlans);
router.get('/:id', checkReqParamsIsNumber, managersRouterMiddleware.getOne, managersController.getOne);
router.get('/:id/deals', checkReqParamsIsNumber, managersRouterMiddleware.getOne, dealsRouterMiddleware.getListOfDeals, dealsController.getList);

router.post('/:id/plan', checkReqParamsIsNumber, managersRouterMiddleware.getOne, managersController.setPlan);

module.exports = router;
