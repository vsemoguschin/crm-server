const Router = require('express');
const router = new Router();
const dopsRouterMiddleware = require('./dopsRouterMiddleware');
const dopsController = require('./dopsController');

//список типов
router.get('/types', dopsController.getDopTypes);
// router.post('/types', dopsController.createAdTags);
// router.delete('/types/:tagId', checkReqParamsIsNumber, dopsController.deleteAdTags);

// router.post('/', dopsRouterMiddleware.create, dopsController.create); //создание только внутри сделки
router.get('/:id', dopsRouterMiddleware.getOne, dopsController.getOne);
router.get('/', dopsRouterMiddleware.getList, dopsController.getList);
router.patch('/:id', dopsRouterMiddleware.getOne, dopsController.update);
router.delete('/:id', dopsRouterMiddleware.getOne, dopsController.delete);

module.exports = router;
