const Router = require("express");
const router = new Router();
const UsersRouterMiddleware = require("./usersRouterMiddleware");
const usersController = require("./usersController");
// const avatarUploadMiddleware = require("../middleware/avatarUploadMiddleware");

router.post(
  "/",
  // (req)=>{console.log(req)},
  UsersRouterMiddleware.create,
  // avatarUploadMiddleware.uploadFile,
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
  // avatarUploadMiddleware.uploadFile,
  usersController.update
);
router.get("/:id", usersController.getOne);
router.delete("/:id", usersController.delete);

module.exports = router;
