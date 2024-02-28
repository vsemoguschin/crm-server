const ApiError = require('../../error/apiError');
const { modelFields: usersModelFields, User } = require('./usersModel');
const modelsService = require('../../services/modelsService');
const { Role } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');

const PERMISSIONS = {
  ['ADMIN']: true,
  ['G']: true,
  ['KD']: true,
  ['DO']: true,
  ['ROP']: true,
  ['ROV']: true,
  ['DP']: true,
  ['RP']: true,
  access: {
    ['ADMIN']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
    ['G']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
    ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
    //commercial
    ['DO']: ['ROP', 'MOP', 'ROV', 'MOV'],
    ['ROP']: ['MOP'],
    //production
    ['DP']: ['RP', 'FRZ', 'MASTER', 'PACKER'],
    ['RP']: ['FRZ', 'MASTER', 'PACKER'],
  },
};

class UsersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      const req_role = req.body.role; //переданная роль
      const access = PERMISSIONS.access[requester];
      const roles_access = access.includes(req_role);
      if (!access || !roles_access) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const userRole = await Role.findOne({
        where: { shortName: req_role },
      });
      if (!userRole) {
        console.log(false, 'role not found');
        throw ApiError.Forbidden('Not found', 'role');
      }
      req.newUser = await modelsService.checkFields([User, usersModelFields], req.body);
      req.userRole = userRole;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      const access = PERMISSIONS.access[requester];
      if (!access) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.rolesFilter = access;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      const access = PERMISSIONS.access[requester];
      if (!access) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.rolesFilter = access;
      next();
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const requester = req.user.role;
      const access = PERMISSIONS.access[requester];
      if (!access) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //получение доступных ролей
      const availableRoles = access;
      let reqRole = req.body.role; //переданная роль
      if (reqRole && availableRoles.includes(reqRole)) {
        reqRole = await Role.findOne({
          where: {
            shortName: reqRole,
          },
        });
        req.reqRole = reqRole;
      }
      req.rolesFilter = availableRoles;
      req.updateFields = ['fullName'];
      next();
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    const requester = req.user.role;
    if (!PERMISSIONS[requester]) {
      console.log(false, 'no acces');
      throw ApiError.Forbidden('Нет доступа');
    }
    //получение доступных ролей
    const availableRoles = rolesList[requester].availableRoles;
    req.rolesFilter = availableRoles;
    next();
  }
}

module.exports = new UsersRouterMiddleware();
