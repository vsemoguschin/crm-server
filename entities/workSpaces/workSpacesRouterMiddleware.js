const ApiError = require('../../error/apiError');
const { modelFields: workSpacesModelFields, WorkSpace } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const { Stage, Order, User } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');

const frontOptions = {
  modelFields: modelsService.getModelFields(workSpacesModelFields),
};
const permissions = ['ADMIN', 'G', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['title'];
const searchFields = ['title', 'department'];

class WorkSpacesRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.newWorkSpace = await modelsService.checkFields(workSpacesModelFields, req.body);

      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      let department = ['PRODUCTION', 'COMERCIAL'];
      if (rolesList.find((user) => user.shortName === requester)) {
        department = [rolesList.find((user) => user.shortName === requester).department];
      }
      const workspace = await WorkSpace.findOne({
        where: {
          id: +req.params.id,
          department: department,
        },
        attributes: ['title', 'id', 'department'],
        include: {
          association: 'members',
          // where: {
          //   id: req.user.id,
          // },
        },
      });
      if (!workspace) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.workspace = workspace;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.searchFields = searchFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updateFields = updateFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async addOrders(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP', 'ROP', 'MOP', 'ROV', 'MOV'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      if (!req.body.orderId || isNaN(+req.body.orderId)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const workspace = await WorkSpace.findOne({
        where: {
          id: req.params.id,
          department: 'PRODUCTION',
        },
      });
      const order = await Order.findOne({
        where: { id: +req.body.orderId },
      });
      if (!workspace || !order || order.workSpaceId !== null) {
        console.log(false, 'No workspace or order');
        throw ApiError.BadRequest('No workspace or order');
      }
      // console.log(workspace.id);
      req.params.id = req.body.orderId;
      req.updates = { workSpaceId: workspace.id, status: 'Доступный', stageId: 1 };

      next();
    } catch (e) {
      next(e);
    }
  }
  async addUsers(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      if (!req.params.userId || isNaN(+req.params.userId)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const workspace = await WorkSpace.findOne({
        where: {
          id: req.params.id,
          department: 'PRODUCTION',
        },
        include: {
          association: 'members',
        },
      });
      const user = await User.findOne({
        where: { id: +req.params.userId },
      });
      if (!workspace || !user || user.department !== 'PRODUCTION') {
        console.log(false, 'No workspace or user');
        throw ApiError.BadRequest('No workspace or user');
      }
      await workspace.addMembers(user);
      return res.json(workspace);
    } catch (e) {
      next(e);
    }
  }
  async ordersList(req, res, next) {
    try {
      const requester = req.user.role;
      console.log(req.params, req.query);
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      if (!req.query.stageId || isNaN(+req.query.stageId)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const workspace = await WorkSpace.findOne({
        where: { id: +req.params.id },
        attributes: ['id'],
      });
      const stage = await Stage.findOne({
        where: { id: +req.query.stageId },
        attributes: ['id'],
      });
      if (!workspace && !stage) {
        console.log(false, 'No workspace or stage');
        throw ApiError.BadRequest('No workspace or stage');
      }

      next();
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req, res, next) {
    try {
      const requester = req.user.role;
      console.log(req.params, req.query);
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const workspace = await WorkSpace.findOne({
        where: { id: +req.params.id },
        attributes: ['id'],
        include: 'members',
      });
      if (!workspace) {
        console.log(false, 'No workspace');
        throw ApiError.BadRequest('No workspace');
      }
      return res.json(workspace.members);
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpacesRouterMiddleware();
