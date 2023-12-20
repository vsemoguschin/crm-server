const Router = require('express');
const router = new Router;
const dealsRouterMiddleware = require('./dealsRouterMiddleware');
const dealsController = require('./dealsController');

router.post('/', dealsRouterMiddleware.create, dealsController.create);
router.get('/:id', dealsRouterMiddleware.getOne, dealsController.getOne);
router.get('/', dealsRouterMiddleware.getList, dealsController.getList);
// router.patch('/:id', dealsController.update);
// router.delete('/:id', dealsController.delete);


module.exports = router;