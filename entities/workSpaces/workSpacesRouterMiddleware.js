const ApiError = require('../../error/apiError');
const { modelFields: workSpacesModelFields, WorkSpace } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const { Stage, Order, User, Deal, Role } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');
const { Op } = require('sequelize');

const PERMISSIONS = {
  ['PRODUCTION']: {
    create: ['ADMIN', 'G', 'DP'],
  },
  ['COMMERCIAL']: {
    create: ['ADMIN', 'G', 'KD'],
  },
};

class WorkSpacesRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      if (requester !== 'ADMIN' && requester !== 'G') {
        req.body.department = rolesList[requester].department;
      }
      req.newWorkSpace = await modelsService.checkFields([WorkSpace, workSpacesModelFields], req.body);
      const { department } = req.body;
      if (!PERMISSIONS[department].create.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      const departmentFilter = rolesList[requester].department;
      let workSpace;
      if (requester == 'ADMIN' || requester == 'G') {
        workSpace = await WorkSpace.findOne({
          where: {
            id: req.params.id,
          },
          include: {
            association: 'members',
          },
        });
      } else {
        workSpace = await WorkSpace.findOne({
          where: {
            id: req.params.id,
            department: departmentFilter,
          },
          attributes: ['title', 'id', 'department'],
          include: {
            association: 'members',
            // where: {
            //   id: req.user.id,
            // },
            attributes: ['fullName'],
          },
        });
      }
      if (!workSpace) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.workSpace = workSpace;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      req.searchFields = ['title', 'department'];
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updateFields = ['title'];
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      next();
    } catch (e) {
      next(e);
    }
  }

  //добавить пользователя в пространство
  async addUsers(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      let include = [
        {
          model: User,
          as: 'members',
          where: {
            id: req.user.id,
          },
        },
      ];

      if (['ADMIN', 'G'].includes(requester)) {
        include = [];
      }

      const user = await User.findOne({
        where: { id: req.params.userId },
        include: [
          {
            model: Role,
            where: {
              shortName: rolesList[requester].availableRoles,
            },
          },
        ],
      });
      if (!user) {
        console.log(false, 'No user');
        throw ApiError.BadRequest('No user');
      }

      const workSpace = await WorkSpace.findOne({
        where: {
          id: req.params.id,
          department: user.role.department,
        },
        include: include,
      });
      if (!workSpace) {
        console.log(false, 'No workSpace');
        throw ApiError.BadRequest('No workSpace');
      }
      await workSpace.addMembers(user);
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
  //удалить пользователя из пространства
  async deleteUsers(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'KD', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      let include = [
        {
          model: User,
          as: 'members',
          where: {
            id: req.user.id,
          },
        },
      ];

      if (['ADMIN', 'G'].includes(requester)) {
        include = [];
      }
      const user = await User.findOne({
        where: { id: req.params.userId },
        include: 'role',
      });
      if (!user) {
        console.log(false, 'No user');
        throw ApiError.BadRequest('No user');
      }
      const workSpace = await WorkSpace.findOne({
        where: {
          id: req.params.id,
          department: user.role.department,
        },
        include: include,
      });
      if (!workSpace) {
        console.log(false, 'No workSpace');
        throw ApiError.BadRequest('No workSpace');
      }
      await workSpace.removeMembers(user);
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
  //добавить заказ в пространство производства
  async addOrders(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const workSpace = await WorkSpace.findOne({
        where: {
          id: req.params.id,
          department: 'PRODUCTION',
        },
      });
      const order = await Order.findOne({
        where: { id: +req.params.orderId },
        include: 'deal',
      });
      if (!workSpace || !order) {
        console.log(false, 'No workSpace or order');
        throw ApiError.BadRequest('No workSpace or order');
      }

      // console.log(workSpace.id);
      req.params.id = req.params.orderId;
      req.updates = { workSpaceId: workSpace.id, status: 'Доступный', stageId: 1 };

      next();
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    const { role } = req.query;
    try {
      const requester = req.user.role;
      console.log(req.params, req.query);
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const filter = await modelsService.searchFilter(['fullName'], req.query);
      const roleFilter = { id: { [Op.gt]: 0 } };
      if (role) {
        roleFilter.shortName = role;
      }
      const workSpace = await WorkSpace.findOne({
        where: { id: +req.params.id },
        attributes: ['id'],
        include: [
          {
            association: 'members',
            include: [
              {
                association: 'role',
                where: roleFilter,
              },
            ],
            where: { ...filter },
          },
        ],
      });
      if (!workSpace) {
        console.log(false, 'Not found');
        throw ApiError.BadRequest('Not found');
      }
      return res.json(workSpace.members);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpacesRouterMiddleware();
