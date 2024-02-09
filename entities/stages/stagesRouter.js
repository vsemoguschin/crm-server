const Router = require('express');
const router = new Router();
const stagesRouterMiddleware = require('./stagesRouterMiddleware');
const stagesController = require('./stagesController');

// router.post('/', stagesRouterMiddleware.create, stagesController.create);//создание только внутри сделки
// router.get('/:id', stagesRouterMiddleware.getOne, stagesController.getOne);
router.get('/', stagesRouterMiddleware.getList, stagesController.getList);
// router.put('/:id', stagesRouterMiddleware.update, stagesController.update);
// router.delete('/:id', stagesRouterMiddleware.delete, stagesController.delete);

module.exports = router;
