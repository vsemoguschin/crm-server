const Router = require('express');
const router = new Router();
const filesRouterMiddleware = require('./filesRouterMiddleware');
const filesController = require('./filesController');

router.post('/', filesRouterMiddleware.create, filesController.create);
router.get('/download', filesController.download);

module.exports = router;
