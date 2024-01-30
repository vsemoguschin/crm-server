const Router = require('express');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

const authRouter = require('./authRouter');
const usersRouter = require('../entities/users/usersRouter');
const clientsRouter = require('../entities/clients/clientsRouter');
const dealsRouter = require('../entities/deals/dealsRouter');
const dopsRouter = require('../entities/dops/dopsRouter');
const paymentsRouter = require('../entities/payments/paymentsRouter');
const deliveriesRouter = require('../entities/deliveries/deliveriesRouter');
const orderRouter = require('../entities/orders/ordersRouter');
const stageRouter = require('../entities/stages/stageRouter');
const filesRouter = require('../entities/files/filesRouter');
const profileRouter = require('./profileRouter');
const ApiError = require('../error/apiError');

router.use(
  '/',
  authRouter, //роутер авторизации
  AuthMiddleware, //проверка авторизации
);
router.use('/users', usersRouter);
router.use('/clients', clientsRouter);
router.use('/dops', dopsRouter);
router.use('/deals', dealsRouter);
router.use('/profile', profileRouter);
router.use('/payments', paymentsRouter);
router.use('/deliveries', deliveriesRouter);
router.use('/orders', orderRouter);
router.use('/stages', stageRouter);
router.use('/files', filesRouter);
router.use('/', (req, res) => {
  throw ApiError.BadRequest('Wrong Path')
});

//git commit --amend --no-edit // позлей изменения в предыдущий коммит
//git commit --amend -m 'text' // Изменить коммит на новый
module.exports = router;
