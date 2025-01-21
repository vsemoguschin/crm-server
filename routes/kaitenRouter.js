const Router = require('express');
const kaitenController = require('../controllers/kaitenController');
const router = new Router();

//список преордеров
router.get('/card/:id', kaitenController.getCard);

module.exports = router;
