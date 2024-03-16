const Router = require('express');
const router = new Router();
const usersRouterMiddleware = require('./usersRouterMiddleware');
const usersController = require('./usersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');
const clientsController = require('../clients/clientsController');
const clientsRouterMiddleware = require('../clients/clientsRouterMiddleware');
const dealsRouterMiddleware = require('../deals/dealsRouterMiddleware');
const dealsController = require('../deals/dealsController');
const ordersRouterMiddleware = require('../orders/ordersRouterMiddleware');
const ordersController = require('../orders/ordersController');
const dopsRouterMiddleware = require('../dops/dopsRouterMiddleware');
const dopsController = require('../dops/dopsController');
const ApiError = require('../../error/apiError');

const allowed = {
  ['ADMIN']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'LAM', 'MASTER', 'PACKER'],
  ['G']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
  ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
  //commercial
  ['DO']: ['ROP', 'MOP', 'ROV', 'MOV'],
  ['ROP']: ['MOP'],
  //production
  ['DP']: ['RP', 'FRZ', 'MASTER', 'PACKER'],
  ['RP']: ['FRZ', 'MASTER', 'PACKER'],
};
const PERMISSIONS = {
  create(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      const req_role = req.body.role; //переданная роль
      if (!req_role) {
        console.log(false, 'no role');
        throw ApiError.BadRequest('Нет роли', 'role');
      }
      if (!allowed[requesterRole] || !allowed[requesterRole].includes(req_role)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  },
};

router.post('/', PERMISSIONS.create, usersRouterMiddleware.create, usersController.create);
router.get('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersController.getOne);
router.get('/', usersRouterMiddleware.getList, usersController.getList);
router.patch('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersRouterMiddleware.update, usersController.update);
router.delete('/:id', checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersRouterMiddleware.delete, usersController.delete);

router.get('/:id/clients', checkReqParamsIsNumber, usersRouterMiddleware.getOne, clientsRouterMiddleware.getList, clientsController.getList);
router.get('/:id/deals', checkReqParamsIsNumber, usersRouterMiddleware.getOne, dealsRouterMiddleware.getList, dealsController.getList);
router.get('/:id/orders', checkReqParamsIsNumber, usersRouterMiddleware.getOne, ordersRouterMiddleware.getList, ordersController.getList);
router.get('/:id/dops', checkReqParamsIsNumber, usersRouterMiddleware.getOne, dopsRouterMiddleware.getList, dopsController.getList);
router.get('/:id/work', checkReqParamsIsNumber, usersRouterMiddleware.getOne, ordersRouterMiddleware.getList, ordersController.getList);
// router.get('/:id/seles', ...);

module.exports = router;
