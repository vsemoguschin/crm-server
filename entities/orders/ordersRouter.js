const Router = require('express');
const router = new Router();
const ordersRouterMiddleware = require('./ordersRouterMiddleware');
const ordersController = require('./ordersController');
const neonsController = require('../neons/neonsController');
const neonsRouterMiddleware = require('../neons/neonsRouterMiddleware');
const filesRouterMiddleware = require('../files/filesRouterMiddleware');
const filesController = require('../files/filesController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const stagesRouterMiddleware = require('../stages/stagesRouterMiddleware');
const usersRouterMiddleware = require('../users/usersRouterMiddleware');
const usersController = require('../users/usersController');
const workSpacesRouterMiddleware = require('../workSpaces/workSpacesRouterMiddleware');

//список преордеров
router.get('/preorders', ordersRouterMiddleware.preorders, ordersController.getList);

// router.post('/', ordersRouterMiddleware.create, ordersController.create); //создание заказа только внутри сделки
router.get('/:id', ordersRouterMiddleware.getOne, ordersController.getOne);
router.get('/', ordersRouterMiddleware.getList, ordersController.getList);
router.patch('/:id', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.update);
router.delete('/:id', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.delete);

router.post('/:id/neons', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, neonsRouterMiddleware.create, neonsController.create);
router.get('/:id/neons', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, neonsRouterMiddleware.getList, neonsController.getList);

router.post('/:id/files', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, filesRouterMiddleware.ordersImgs, filesController.create);
router.get('/:id/files', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, filesRouterMiddleware.getList, filesController.getList);

//добавление заказов в workSpace
router.patch('/:id/workspaces/:workSpaceId', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, workSpacesRouterMiddleware.addOrders);

router.get('/:id/executors', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, usersRouterMiddleware.getList, usersController.getList);
//добавление и удаление исполнителей из заказа
router.patch(
  '/:id/executors/:userId',
  checkReqParamsIsNumber,
  ordersRouterMiddleware.getOne,
  usersRouterMiddleware.getOne,
  ordersRouterMiddleware.setExecutor,
);
router.delete('/:id/executors/:userId', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersRouterMiddleware.removeExecutor);

//перемещение заказа по стадиям
router.patch(
  '/:id/stages/:stageId',
  checkReqParamsIsNumber,
  ordersRouterMiddleware.getOne,
  stagesRouterMiddleware.getOne,
  ordersRouterMiddleware.changeStage,
);

//перемещение заказа по стадиям
router.patch(
  '/:id/stage/:stageId',
  checkReqParamsIsNumber,
  ordersRouterMiddleware.getOne,
  // stagesRouterMiddleware.getOne,
  stagesRouterMiddleware.moveOrder,
  // ordersRouterMiddleware.changeStage,
);
//Назначение мастера
router.patch('/:id/master/:masterId', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.setMaster);
router.patch('/:id/frezer/:frezerId', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.setFrezer);
router.patch('/:id/laminater/:laminaterId', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.setLaminater);
router.patch('/:id/packer/:packerId', checkReqParamsIsNumber, ordersRouterMiddleware.getOne, ordersController.setPacker);

module.exports = router;
