const Router = require('express');
const router = new Router();
const stagesRouterMiddleware = require('./stagesRouterMiddleware');
const stagesController = require('./stagesController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

// router.post('/', stagesRouterMiddleware.create, stagesController.create);//создание только внутри сделки
router.get('/available', stagesRouterMiddleware.getList, stagesController.getList);
router.get('/:id', checkReqParamsIsNumber, stagesRouterMiddleware.getOne, stagesController.getOne);
router.get('/', stagesController.getList);
// router.patch('/:id', stagesRouterMiddleware.update, stagesController.update);
// router.delete('/:id', stagesRouterMiddleware.delete, stagesController.delete);

module.exports = router;
