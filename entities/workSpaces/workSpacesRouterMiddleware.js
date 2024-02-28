const ApiError = require('../../error/apiError');
const { modelFields: workSpacesModelFields, WorkSpace } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const { Order } = require('../association');
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
          include: [
            {
              association: 'members',
            },
            'creator',
          ],
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
            where: {
              id: req.user.id,
            },
            attributes: ['fullName'],
          },
        });
      }
      if (!workSpace) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      // delete workSpace.dataValues.members;
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
        where: {
          id: +req.params.orderId,
        },
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
}

module.exports = new WorkSpacesRouterMiddleware();
