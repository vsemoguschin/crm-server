const Router = require('express');
const router = new Router();
const filesRouterMiddleware = require('./filesRouterMiddleware');
const filesController = require('./filesController');

router.post('/', filesRouterMiddleware.create, filesController.create);
// router.get('/:id', filesRouterMiddleware.getOne, filesController.getOne);
// router.get('/', filesRouterMiddleware.getList, filesController.getList);
// router.put('/:id', filesRouterMiddleware.update, filesController.update);
router.delete('/:id', filesRouterMiddleware.delete, filesController.delete);

module.exports = router;
