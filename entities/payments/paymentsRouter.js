const Router = require("express");
const router = new Router();
const PaymentsRouterMiddleware = require("./paymentsRouterMiddleware");
const paymentsController = require("./paymentsController");

router.post(
  "/",
  PaymentsRouterMiddleware.create,
  paymentsController.create
);

router.get(
  '/:id',
  PaymentsRouterMiddleware.getOne,
  paymentsController.getOne
);

router.get(
  '/',
  PaymentsRouterMiddleware.getList,
  paymentsController.getList
);

module.exports = router;
