const Router = require('express');
const router = new Router();
const profileController = require('../controllers/profileController');
const profileRouterMiddleware = require('../middleware/profileRouterMiddleware');

router.get('/', profileController.getProfile);
router.patch('/', profileRouterMiddleware.updateProfile, profileController.update);

//аватарка
// router.put('/avatar');
module.exports = router;
