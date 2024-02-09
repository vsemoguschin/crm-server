const ApiError = require('../error/apiError');
const Router = require('express');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

const authRouter = require('./authRouter');
const usersRouter = require('../entities/users/usersRouter');
const workSpacesRouter = require('../entities/workSpaces/workSpacesRouter');
const clientsRouter = require('../entities/clients/clientsRouter');
const dealsRouter = require('../entities/deals/dealsRouter');
const dopsRouter = require('../entities/dops/dopsRouter');
const paymentsRouter = require('../entities/payments/paymentsRouter');
const deliveriesRouter = require('../entities/deliveries/deliveriesRouter');
const ordersRouter = require('../entities/orders/ordersRouter');
const neonsRouter = require('../entities/neons/neonsRouter');
const filesRouter = require('../entities/files/filesRouter');
const stagesRouter = require('../entities/stages/stagesRouter');
const profileRouter = require('./profileRouter');

router.use(
  '/',
  authRouter, //роутер авторизации
  AuthMiddleware, //проверка авторизации
);
router.use('/users', usersRouter);
router.use('/clients', clientsRouter);
router.use('/workspaces', workSpacesRouter);
router.use('/dops', dopsRouter);
router.use('/deals', dealsRouter);
router.use('/payments', paymentsRouter);
router.use('/deliveries', deliveriesRouter);
router.use('/files', filesRouter);
router.use('/orders', ordersRouter);
router.use('/neons', neonsRouter);
router.use('/stages', stagesRouter);
// router.use('/delivery', profileRouter);
router.use('/profile', profileRouter);
router.use('/', (req, res) => {
  throw ApiError.BadRequest('Wrong Path');
});

//git commit --amend --no-edit // позлей изменения в предыдущий коммит
//git commit --amend -m 'text' // Изменить коммит на новый
module.exports = router;
