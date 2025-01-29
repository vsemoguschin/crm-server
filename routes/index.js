const ApiError = require('../error/apiError');
const Router = require('express');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const cors = require('cors');

const authRouter = require('./authRouter');
// const productionRouter = require('.entities/production');
const dashboardsRouter = require('./dashboardsRouter');
const usersRouter = require('../entities/users/usersRouter');
const managersRouter = require('../entities/managers/managersRouter');
const workSpacesRouter = require('../entities/workSpaces/workSpacesRouter');
const groupsRouter = require('../entities/groups/groupsRouter');
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
const productionRouter = require('../routes/productionRouter');
const kaitenRouter = require('../routes/kaitenRouter');

// const allowedOrigins =
//   process.env.NODE_ENV === 'production'
//     ? ['https://easy-crm.pro', 'https://www.easy-crm.pro', 'http://easy-crm.pro', 'http://www.easy-crm.pro']
//     : ['http://localhost:3000', 'http://46.19.64.10'];

// router.use(
//   '/',
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200,
//   }),
//   authRouter,
//   AuthMiddleware,
// );

router.use(
  '/',
  cors({
    // credentials: true,
    origin: [
      'http://localhost:3000',
      'http://46.19.64.10:80',
      'http://46.19.64.10:3000',
      'http://46.19.64.10',
      'http://easy-crm.pro',
      'https://46.19.64.10:3000',
      'https://easy-crm.pro',
    ],
  }),
  authRouter, //роутер авторизации
  AuthMiddleware, //проверка авторизации
);

router.use('/dashboards', dashboardsRouter);
router.use('/orders', ordersRouter);
router.use('/production', productionRouter);
router.use('/users', usersRouter);
router.use('/managers', managersRouter);
router.use('/workspaces', workSpacesRouter);
router.use('/groups', groupsRouter);
router.use('/clients', clientsRouter);
router.use('/dops', dopsRouter);
router.use('/deals', dealsRouter);
router.use('/payments', paymentsRouter);
router.use('/deliveries', deliveriesRouter);
router.use('/files', filesRouter);
router.use('/orders', ordersRouter);
router.use('/neons', neonsRouter);
router.use('/stages', stagesRouter);
router.use('/profile', profileRouter);
router.use('/kaiten', kaitenRouter);
router.use('/', (req) => {
  console.log(req);
  throw ApiError.BadRequest('Wrong Path');
});

module.exports = router;
