const Router = require('express');
const router = new Router();
const clientsRouterMiddleware = require('./clientsRouterMiddleware');
const clientsController = require('./clientsController');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

//список сфер деятельности
router.get('/spheres', clientsController.getSpheres);
router.post('/spheres', clientsController.createSpheres);
router.delete('/spheres/:sphereId', checkReqParamsIsNumber, clientsController.deleteSpheres);

// router.post('/', clientsRouterMiddleware.create, clientsController.create); //через воркспейс
router.get('/:id', checkReqParamsIsNumber, clientsRouterMiddleware.getOne, clientsController.getOne);
router.get('/', clientsRouterMiddleware.getList, clientsController.getList);
router.patch('/:id', checkReqParamsIsNumber, clientsRouterMiddleware.getOne, clientsController.update);
router.delete('/:id', checkReqParamsIsNumber, clientsRouterMiddleware.getOne, clientsController.delete);

//создание и получение заказов внутри сделки
router.post('/:id/deals', checkReqParamsIsNumber, clientsRouterMiddleware.getOne, dealsRouterMiddleware.create, dealsController.create);
router.get('/:id/deals', checkReqParamsIsNumber, clientsRouterMiddleware.getOne, dealsRouterMiddleware.getList, dealsController.getList);

module.exports = router;
