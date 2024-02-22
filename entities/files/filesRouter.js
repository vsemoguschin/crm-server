const Router = require('express');
const router = new Router();
const filesRouterMiddleware = require('./filesRouterMiddleware');
const filesController = require('./filesController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

router.delete('/:id', checkReqParamsIsNumber, filesRouterMiddleware.delete, filesController.delete);

module.exports = router;
