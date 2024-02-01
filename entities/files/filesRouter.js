const Router = require('express');
const router = new Router();
const filesRouterMiddleware = require('./filesRouterMiddleware');
const filesController = require('./filesController');

router.delete('/:id', filesRouterMiddleware.delete, filesController.delete);

module.exports = router;
