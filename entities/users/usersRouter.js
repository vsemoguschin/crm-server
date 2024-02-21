const ApiError = require('../../error/apiError');
const Router = require('express');
const router = new Router();
const { ROLES: rolesList } = require('../roles/rolesList');
const usersRouterMiddleware = require('./usersRouterMiddleware');
const usersController = require('./usersController');
const checkReqParamsIsNumber = require('../../checking/checkReqParamsIsNumber');

const PERMISSIONS = {
  ['ADMIN']: true,
  ['G']: true,
  ['KD']: true,
  ['DO']: true,
  ['ROP']: true,
  ['ROV']: true,
  ['DP']: true,
  ['RP']: true,
};

function checkPermissions(req, res, next) {
  try {
    const requester = req.user.role;
    //проверка на доступ к методу
    if (!PERMISSIONS[requester]) {
      console.log(false, 'no acces');
      throw ApiError.Forbidden('Нет доступа');
    }
    //получение доступных ролей
    req.availableRoles = rolesList[requester].availableRoles;
    // console.log(req.availableRoles);
    next();
  } catch (e) {
    next(e);
  }
}

router.post('/', checkPermissions, usersRouterMiddleware.create, usersController.create);
router.get('/:id', checkPermissions, checkReqParamsIsNumber, usersRouterMiddleware.getOne, usersController.getOne);
router.get('/', checkPermissions, usersRouterMiddleware.getList, usersController.getList);
router.put('/:id', checkPermissions, checkReqParamsIsNumber, usersRouterMiddleware.update, usersController.update);
router.delete('/:id', checkPermissions, checkReqParamsIsNumber, usersRouterMiddleware.delete, usersController.delete);

module.exports = router;
