const Router = require('express');
const router = new Router();
const groupsRouterMiddleware = require('./groupsRouterMiddleware');
const groupsController = require('./groupsController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const usersRouterMiddleware = require('../users/usersRouterMiddleware');
const usersController = require('../users/usersController');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');

router.get('/:id', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, groupsController.getOne);
router.get('/:id/deals', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, dealsRouterMiddleware.getListOfDeals, dealsController.getList);
router.get('/', groupsRouterMiddleware.getList, groupsController.getList);
router.patch('/:id', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, groupsController.update);
router.delete('/:id', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, groupsController.delete);

router.post('/:id/manager', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, usersRouterMiddleware.create, usersController.createManager);
router.get('/:id/users', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, usersRouterMiddleware.getList, usersController.getList);
router.patch('/:id/users/:userId', checkReqParamsIsNumber, groupsRouterMiddleware.getOne, usersRouterMiddleware.getOne, groupsController.addUsers);
router.delete(
  '/:id/users/:userId',
  checkReqParamsIsNumber,
  groupsRouterMiddleware.getOne,
  usersRouterMiddleware.getOne,
  groupsController.removeUsers,
);

module.exports = router;
