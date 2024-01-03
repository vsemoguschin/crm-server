const Router = require('express');
const router = new Router();
const filesRouterMiddleware = require('./filesRouterMiddleware');
const filesController = require('./dopsController');

router.post('/', filesRouterMiddleware.create, filesController.create);

module.exports = router;
