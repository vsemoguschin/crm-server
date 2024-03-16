const Router = require('express');
const router = new Router();
const workSpacesRouterMiddleware = require('./workSpacesRouterMiddleware');
const workSpacesController = require('./workSpacesController');
const ordersController = require('../orders/ordersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const clientsRouterMiddleware = require('../clients/clientsRouterMiddleware');
const clientsController = require('../clients/clientsController');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');
const deliveriesRouterMiddleware = require('../deliveries/deliveriesRouterMiddleware');
const deliveriesController = require('../deliveries/deliveriesController');
const usersController = require('../users/usersController');
const usersRouterMiddleware = require('../users/usersRouterMiddleware');
const stagesRouterMiddleware = require('../stages/stagesRouterMiddleware');
const groupsController = require('../groups/groupsController');
const groupsRouterMiddleware = require('../groups/groupsRouterMiddleware');

router.post('/', workSpacesRouterMiddleware.create, workSpacesController.create);
router.get('/', workSpacesRouterMiddleware.getList, workSpacesController.getList);
router.get('/prod', workSpacesController.prod);
router.get('/:id', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, workSpacesController.getOne);
router.patch('/:id', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, workSpacesController.update);
router.delete('/:id', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, workSpacesController.delete);

//источники сделок
router.get('/:id/sources', workSpacesRouterMiddleware.getOne, dealsController.getSources);
router.post('/:id/sources', workSpacesRouterMiddleware.getOne, dealsController.createSources);
router.delete('/:id/sources/:sourceId', workSpacesRouterMiddleware.getOne, checkReqParamsIsNumber, dealsController.deleteSources);

//добавление и получение пользователей внутри workSpace
router.patch(
  '/:id/users/:userId',
  checkReqParamsIsNumber,
  usersRouterMiddleware.getOne,
  workSpacesRouterMiddleware.getOne,
  workSpacesController.addUsers,
);
router.delete(
  '/:id/users/:userId',
  checkReqParamsIsNumber,
  workSpacesRouterMiddleware.getOne,
  usersRouterMiddleware.getOne,
  workSpacesController.deleteUsers,
);
router.get('/:id/users', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, usersRouterMiddleware.getList, usersController.getList);

//создание и получение клиентов в воркспейсе
router.post('/:id/clients/', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, clientsRouterMiddleware.create, clientsController.create);
router.get('/:id/clients/', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, clientsRouterMiddleware.getList, clientsController.getList);

//получение сделок воркспейса для коммерческого отдела
router.get('/:id/deals', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, dealsRouterMiddleware.getList, dealsController.getList);

//доска заказов для PRODUCTION
router.get(
  '/:id/stages/:stageId',
  checkReqParamsIsNumber,
  workSpacesRouterMiddleware.getOne,
  stagesRouterMiddleware.getOne,
  ordersController.stageList,
);

//отправки workSpace
router.get(
  '/:id/deliveries',
  checkReqParamsIsNumber,
  workSpacesRouterMiddleware.getOne,
  deliveriesRouterMiddleware.getList,
  deliveriesController.workSpaceList,
);

//создание тегов для пользователей
router.post('/:id/groups', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, groupsController.create);
router.get('/:id/groups', checkReqParamsIsNumber, workSpacesRouterMiddleware.getOne, groupsRouterMiddleware.getList, groupsController.getList);

module.exports = router;
