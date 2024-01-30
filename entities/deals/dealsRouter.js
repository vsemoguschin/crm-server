const Router = require('express');
const router = new Router();
const dealsRouterMiddleware = require('./dealsRouterMiddleware');
const dealsController = require('./dealsController');

router.post('/', dealsRouterMiddleware.create, dealsController.create);
router.get('/:id', dealsRouterMiddleware.getOne, dealsController.getOne);
router.get('/', dealsRouterMiddleware.getList, dealsController.getList);
router.put('/:id', dealsRouterMiddleware.update, dealsController.update);
router.delete('/:id', dealsRouterMiddleware.delete, dealsController.delete);

module.exports = router;
