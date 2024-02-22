const Router = require('express');
const router = new Router();
const usersRouterMiddleware = require('./usersRouterMiddleware');
const usersController = require('./usersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

router.post('/', usersRouterMiddleware.create, usersController.create);
router.get('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersController.getOne);
router.get('/', usersRouterMiddleware.getList, usersController.getList);
router.put('/:id', checkReqParamsIsNumber, usersRouterMiddleware.update, usersController.update);
router.delete('/:id', checkReqParamsIsNumber, usersRouterMiddleware.delete, usersController.delete);

module.exports = router;
