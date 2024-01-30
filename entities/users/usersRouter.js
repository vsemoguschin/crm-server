const Router = require("express");
const router = new Router();
const UsersRouterMiddleware = require("./usersRouterMiddleware");
const usersController = require("./usersController");

router.post(
  "/",
  UsersRouterMiddleware.create,
  usersController.create
);
router.get(
  "/:id",
  UsersRouterMiddleware.getOne,
  usersController.getOne
);

router.get(
  "/",
  UsersRouterMiddleware.getList,
  usersController.getList
);
router.put(
  "/:id",
  UsersRouterMiddleware.updateUser,
  usersController.update
);
router.delete(
  "/:id",
  UsersRouterMiddleware.deleteUser,
  usersController.delete
);

module.exports = router;
