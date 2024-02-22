const ApiError = require('../../error/apiError');
const { modelFields: usersModelFields, User } = require('./usersModel');
const modelsService = require('../../services/modelsService');
const { Role } = require('../association');
const { Op } = require('sequelize');
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
};

class UsersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      if (!PERMISSIONS[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //получение доступных ролей
      const availableRoles = rolesList[requester].availableRoles;
      const reqRole = req.body.role; //переданная роль
      if (!reqRole) {
        console.log(false, 'no role');
        throw ApiError.BadRequest('Что то забыл', 'role');
      }
      // console.log(availableRoles, reqRole);
      const userRole = await Role.findOne({
        where: {
          [Op.and]: [
            {
              shortName: [reqRole],
            },
            {
              shortName: availableRoles,
            },
          ],
        },
      });
      if (!userRole) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа', 'role');
      }
      // console.log(usersModelFields);
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
      if (!PERMISSIONS[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //получение доступных ролей
      const availableRoles = rolesList[requester].availableRoles;
      req.rolesFilter = availableRoles;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      if (!PERMISSIONS[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //получение доступных ролей
      const availableRoles = rolesList[requester].availableRoles;
      req.rolesFilter = availableRoles;
      req.searchFields = ['fullName'];
      next();
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const requester = req.user.role;
      if (!PERMISSIONS[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //получение доступных ролей
      const availableRoles = rolesList[requester].availableRoles;
      let reqRole = req.body.role; //переданная роль
      if (reqRole) {
        reqRole = await Role.findOne({
          where: {
            [Op.and]: [
              {
                shortName: reqRole,
              },
              {
                shortName: availableRoles,
              },
            ],
          },
        });
        if (!reqRole) {
          console.log(false, 'no acces');
          throw ApiError.Forbidden('Нет доступа', 'role');
        }
      }
      req.rolesFilter = availableRoles;
      req.reqRole = reqRole;
      req.updateFields = ['fullName', 'role'];
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
