const Router = require("express");
const router = new Router();
const profileController = require("../controllers/profileController");
const avatarUploadMiddleware = require("../middleware/avatarUploadMiddleware");
const profileRouterMiddleware = require("../middleware/profileRouterMiddleware");

router.get("/", profileController.getProfile);
router.put(
  "/",
  profileRouterMiddleware.updateProfile,
  avatarUploadMiddleware.uploadFile,
  profileController.update
);

module.exports = router;
