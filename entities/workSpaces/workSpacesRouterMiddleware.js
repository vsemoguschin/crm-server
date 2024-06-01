const ApiError = require('../../error/apiError');
const { modelFields: workSpacesModelFields, WorkSpace } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const { Order, Deal, User, Role } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');
const { Op, where } = require('sequelize');

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
      const requesterRole = req.requester.role;
      if (!['ADMIN', 'G', 'KD', 'DP'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (requesterRole !== 'ADMIN' && requesterRole !== 'G') {
        req.body.department = rolesList[requesterRole].department;
      }
      req.body.department = 'COMMERCIAL';
      req.newWorkSpace = await modelsService.checkFields([WorkSpace, workSpacesModelFields], req.body);
      const { department } = req.body;
      if (!PERMISSIONS[department].create.includes(requesterRole)) {
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
      const requesterRole = req.requester.role;
      let { id, workSpaceId } = req.params;
      id = workSpaceId || id;
      const searchParams = {
        where: {
          id: id,
        },
        include: [
          'groups',
          {
            model: User,
            include: {
              model: Role,
              where: {
                shortName: 'MOP',
              },
            },
          },
        ],
      };
      const workSpace = await WorkSpace.findOne(searchParams);
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
      const requesterRole = req.requester.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requesterRole)) {
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
      const requesterRole = req.requester.role;
      if (!['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const workSpace = await WorkSpace.findOne({
        where: {
          id: req.params.workSpaceId,
          department: 'PRODUCTION',
        },
      });
      const { order } = req;
      if (!workSpace) {
        throw ApiError.BadRequest('no workspace');
      }
      if (order.delivery) {
        const deliveryWorkspace = order.delivery.workSpaceId;
        if (deliveryWorkspace !== workSpace.id) {
          throw ApiError.BadRequest('Заказ в доставке другого пространства');
        }
      }
      await order.update({ workSpaceId: workSpace.id, status: 'Доступен', stageId: 1 });
      await Deal.update({ status: 'process' }, { where: { id: order.dealId } });
      return res.status(200).json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpacesRouterMiddleware();
