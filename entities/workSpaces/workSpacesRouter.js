const Router = require('express');
const router = new Router;
const workSpacesRouterMiddleware = require('./workSpacesRouterMiddleware');
const workSpacesController = require('./workSpacesController');

router.post('/', workSpacesRouterMiddleware.create, workSpacesController.create);
router.get('/:id', workSpacesRouterMiddleware.getOne, workSpacesController.getOne);
router.get('/', workSpacesRouterMiddleware.getList, workSpacesController.getList);
router.put('/:id', workSpacesRouterMiddleware.update, workSpacesController.update);
router.delete('/:id', workSpacesRouterMiddleware.delete, workSpacesController.delete);

module.exports = router;