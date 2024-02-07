const Router = require('express');
const router = new Router();
const usersRouterMiddleware = require('./usersRouterMiddleware');
const usersController = require('./usersController');

router.post('/', usersRouterMiddleware.create, usersController.create);
router.get('/:id', usersRouterMiddleware.getOne, usersController.getOne);
router.get('/', usersRouterMiddleware.getList, usersController.getList);
router.put('/:id', usersRouterMiddleware.update, usersController.update);
router.delete('/:id', usersRouterMiddleware.delete, usersController.delete);

module.exports = router;
