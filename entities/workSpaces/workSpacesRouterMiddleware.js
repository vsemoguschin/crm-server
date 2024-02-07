const ApiError = require('../../error/apiError');
const { modelFields: workSpacesModelFields, WorkSpace } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const { Stage, Order } = require('../association');

const frontOptions = {
  modelFields: modelsService.getModelFields(workSpacesModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'];
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
      console.log(req.WorkSpace);
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
      req.body.updates = { workSpaceId: workspace.id, status: 'Доступный', stageId: 1 };

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
      next();
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
}

module.exports = new WorkSpacesRouterMiddleware();
