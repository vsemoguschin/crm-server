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
    ['ADMIN']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'LAM', 'MASTER', 'PACKER'],
    ['G']: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
    ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
    //commercial
    ['DO']: ['ROP', 'MOP', 'ROV', 'MOV'],
    ['ROP']: ['MOP'],
    ['MOP']: ['MOP'],
    //production
    ['DP']: ['RP', 'FRZ', 'MASTER', 'PACKER'],
    ['RP']: ['FRZ', 'MASTER', 'PACKER'],
  },
};

class UsersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const req_role = req.body.role; //переданная роль
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
      const requesterRole = req.requester.role;
      const rolesFilter = PERMISSIONS.access[requesterRole];
      let { id, userId } = req.params;
      id = userId || id;
      if (id === req.requester.id) {
        req.user = await User.findOne({
          include: ['role', 'membership', 'avatar'],
          where: {
            id: id,
          },
        });
        return next();
      }
      if (!rolesFilter) {
        throw ApiError.Forbidden('Нет доступа');
      }
      const user = await User.findOne({
        include: ['role', 'membership', 'avatar'],
        where: { id: id, '$role.shortName$': rolesFilter },
      });
      if (!user) {
        return res.status(404).json('user not found');
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const searchFields = ['fullName'];
    const { role } = req.query;
    try {
      const requesterRole = req.requester.role;
      const access = PERMISSIONS.access[requesterRole];
      if (!access) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      let rolesFilter = access;
      console.log(access);
      if (role && access.includes(role)) {
        rolesFilter = role;
      }
      const searchParams = {
        include: [
          {
            model: Role,
            where: {
              shortName: rolesFilter,
            },
          },
        ],
        where: {
          ...searchFilter,
        },
        distinct: true,
      };
      if (req.baseUrl.includes('/workspaces')) {
        const { workSpace } = req;
        searchParams.include.push({
          association: 'membership',
          where: {
            id: workSpace.id,
          },
        });
      }
      if (req.baseUrl.includes('/orders')) {
        const { order } = req;
        searchParams.include.push({
          association: 'work',
          where: {
            id: order.id,
          },
        });
      }

      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      const access = PERMISSIONS.access[requesterRole];
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
    const requesterRole = req.requester.role;
    if (!PERMISSIONS[requesterRole]) {
      console.log(false, 'no acces');
      throw ApiError.Forbidden('Нет доступа');
    }
    //получение доступных ролей
    const availableRoles = rolesList[requesterRole].availableRoles;
    req.rolesFilter = availableRoles;
    next();
  }
}

module.exports = new UsersRouterMiddleware();
