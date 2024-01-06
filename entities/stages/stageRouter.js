const Router = require('express');
const router = new Router();

const stageController = require('./stageController');

router.get('/', stageController.getList);

module.exports = router;
