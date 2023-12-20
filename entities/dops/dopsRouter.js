const Router = require("express");
const router = new Router();
const DopsRouterMiddleware = require("./dopsRouterMiddleware");
const dopsController = require("./dopsController");

router.post(
  "/",
  DopsRouterMiddleware.create,
  dopsController.create
);

module.exports = router;
