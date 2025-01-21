const Router = require('express');
const router = new Router();
const ProductionRouterMiddleware = require('../middleware/productionMiddleware');
const ProductionController = require('../controllers/productionController');
const { getDeal } = require('../entities/deals/dealsRouterMiddleware');
const checkReqParamsIsNumber = require('../checking/checkReqParamsIsNumber');

// router.get('/preorders', ProductionRouterMiddleware.getListOfPreorders, ProductionController.getListOfPreorders);
//получить список заказов в выбранной стадии
router.get('/stage/:stageId', checkReqParamsIsNumber, ProductionRouterMiddleware.getListOfOrders, ProductionController.getListOfOrders);
router.get('/deals', checkReqParamsIsNumber, ProductionRouterMiddleware.getListOfOrdersBySearch, ProductionController.getListOfOrders);
router.get('/deals/:id', checkReqParamsIsNumber, ProductionRouterMiddleware.getDeal, ProductionController.getDeal);
router.get('/workers', checkReqParamsIsNumber, ProductionRouterMiddleware.getWorkers);
router.get('/deliveries', checkReqParamsIsNumber, ProductionRouterMiddleware.getDeliveries);

//перемещаем заказы сделки на производство
router.patch('/deal/:id/status/:statusId', getDeal, ProductionRouterMiddleware.updateStatus, ProductionController.updateStatus);

module.exports = router;
