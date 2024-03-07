const Router = require('express');
const router = new Router();
const filesRouterMiddleware = require('./filesRouterMiddleware');
const filesController = require('./filesController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const diskService = require('../../services/diskService');

router.delete('/:id', checkReqParamsIsNumber, filesRouterMiddleware.delete, filesController.delete);
router.get('/:id', checkReqParamsIsNumber, filesRouterMiddleware.getOne, diskService.downloadFile);

module.exports = router;
