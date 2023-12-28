const Router = require("express");
const router = new Router();
const OrdersRouterMiddleware = require("./ordersRouterMiddleware");
const OrdersController = require("./ordersController");

router.post("/", OrdersRouterMiddleware.create, OrdersController.create);

router.get("/:id", OrdersRouterMiddleware.getOne, OrdersController.getOne);

router.get("/", OrdersRouterMiddleware.getList, OrdersController.getList);

module.exports = router;
