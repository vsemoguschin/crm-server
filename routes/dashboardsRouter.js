const Router = require('express');
const router = new Router();
const dashboardsMiddleware = require('../middleware/dashboardsMiddleware');
// const dashboardsController = require('../controllers/dashboardsController');

router.get('/workspaces', dashboardsMiddleware.workspaces);
router.get('/deals', dashboardsMiddleware.deals);
router.get('/managers', dashboardsMiddleware.managers);

module.exports = router;
