const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: ordersModelFields, Order } = require('./ordersModel');
const { Deal, User, WorkSpace } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');
const { availableStages } = require('../stages/stagesModel');
const { Op } = require('sequelize');

const frontOptions = {
  modelFields: modelsService.getModelFields(ordersModelFields),
};
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = [
  'name',
  'description',
  'material',
  'elements',
  'boardHeight',
  'boardWidth',
  'wireLength',
  'dimer',
  'acrylic',
  'print',
  'laminate',
  'adapter',
  'plug',
  'holeType',
  'fittings',
  'status',
];
const searchFields = ['name'];

class OrdersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка значения и наличия сделки
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const deal = await Deal.findOne({
        where: { id: req.params.id },
      });
      if (!deal) {
        console.log(false, 'No deal');
        throw ApiError.BadRequest('No deal');
      }
      const newOrder = await modelsService.checkFields([Order, ordersModelFields], req.body);
      req.newOrder = newOrder;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester) && !['DP', 'RP', 'FRZ', 'MASTER', 'PACKER'].includes(requester)) {
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
      if (!permissions.includes(requester) && !['DP', 'RP', 'FRZ', 'MASTER', 'PACKER'].includes(requester)) {
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
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updates = await modelsService.checkUpdates(ordersModelFields, req.body, updateFields);
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
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
  async OLDchangeStage(req, res, next) {
    const permissions = [
      [],
      ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'], //присвоить stage1(доступен фрезеровке)
      ['ADMIN', 'G', 'DP', 'RP', 'FRZ'], //присвоить stage2(доступен пленке)
      ['ADMIN', 'G', 'DP', 'RP', 'FRZ', 'LAM'], //присвоить stage3(доступен мастерам)
    ];
    try {
      const requester = req.user.role;
      if (!req.params.id || isNaN(+req.params.id) || !req.params.stageId || isNaN(+req.params.stageId)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const orderid = +req.params.id;
      const stage = +req.params.stageId;
      //проверка, может ли пользователь перемещать заказ в переданную stage
      console.log(requester, stage);
      if (!permissions[stage].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.BadRequest('no acces');
      }
      //проверка, является ли пользователь исполнителем заказа и на предыдущей стейдж
      const order = await Order.findOne({
        where: {
          id: orderid,
          status: 'В работе',
          stageId: stage - 1,
        },
        include: [
          {
            association: 'executors',
            where: {
              id: req.user.id,
            },
          },
        ],
      });
      if (!order) {
        console.log(false, 'no acces');
        throw ApiError.BadRequest('no acces');
      }
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }
  async changeStage(req, res, next) {
    const workStages = {
      ['ADMIN']: [1, 2, 3, 4],
      ['G']: [1, 2, 3, 4],
      ['DP']: [1, 2, 3, 4],
      ['RP']: [1, 2, 3, 4],
      ['FRZ']: [1],
      ['LAM']: [2],
      ['MASTER']: [3],
      ['PACKER']: [4],
    };
    const movement = {
      ['ADMIN']: [1, 2, 3, 4, 5],
      ['G']: [1, 2, 3, 4, 5],
      ['DP']: [1, 2, 3, 4, 5],
      ['RP']: [1, 2, 3, 4, 5],
      ['FRZ']: [2],
      ['LAM']: [3],
      ['MASTER']: [4],
      ['PACKER']: [5],
    };
    try {
      console.log(workStages);
      const requester = req.user.role;
      const orderid = req.params.id;
      const newStage = req.params.stageId;
      if (!workStages[requester] || !workStages[requester].includes(newStage)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //находится ли заказ на стадии с которой может взаимодействовать роль
      const order = await Order.findOne({
        where: {
          id: orderid,
          stageId: workStages[requester],
        },
        attributes: ['stageId'],
        include: [
          {
            model: User,
            as: 'executors',
          },
        ],
      });
      if (!order) {
        console.log(false, 'no order');
        throw ApiError.BadRequest('no order');
      }

      return res.json(order);
      req.updates({ stageId: newStage, status: 'В работе' });
      next();
    } catch (e) {
      next(e);
    }
  }
  async setExecutor(req, res, next) {
    const workStages = {
      ['ADMIN']: [1, 2, 3, 4],
      ['G']: [1, 2, 3, 4],
      ['DP']: [1, 2, 3, 4],
      ['RP']: [1, 2, 3, 4],
      ['FRZ']: [1],
      ['LAM']: [2],
      ['MASTER']: [3],
      ['PACKER']: [4],
    };
    try {
      const requester = req.user.role;
      if (!workStages[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const orderid = req.params.id;
      let candidat = req.params.userId;
      const roleStage = workStages[requester];

      const workSpace = await WorkSpace.findOne({
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id'],
            where: { id: candidat },
            include: 'role',
          },
          {
            model: Order,
            where: {
              id: orderid,
              status: 'Доступный',
              stageId: roleStage,
            },
            include: {
              model: User,
              as: 'executors',
              include: 'role',
            },
          },
        ],
      });
      if (!workSpace) {
        console.log(false, 'no acces');
        throw ApiError.BadRequest('no acces');
      }
      candidat = workSpace.members[0];
      const order = workSpace.orders[0];
      const orderExecutors = workSpace.orders[0].executors;
      if (orderExecutors.find((user) => user.role.shortName === candidat.role.shortName)) {
        console.log(false, 'Уже занят');
        throw ApiError.BadRequest('занят');
      }

      await order.addExecutors(candidat);
      req.updates = { status: 'В работе' };
      next();
    } catch (e) {
      next(e);
    }
  }
  async removeExecutor(req, res, next) {
    const workStages = {
      ['ADMIN']: [1, 2, 3, 4],
      ['G']: [1, 2, 3, 4],
      ['DP']: [1, 2, 3, 4],
      ['RP']: [1, 2, 3, 4],
      ['FRZ']: [1],
      ['LAM']: [2],
      ['MASTER']: [3],
      ['PACKER']: [4],
    };
    try {
      const requester = req.user.role;
      if (!workStages[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const orderid = req.params.id;
      const candidat = req.params.userId;
      const roleStage = workStages[requester];

      const order = await Order.findOne({
        where: {
          id: orderid,
          stageId: roleStage,
        },
        include: [
          {
            model: User,
            as: 'executors',
            where: {
              id: candidat,
            },
          },
        ],
      });
      if (!order) {
        console.log(false, 'no acces');
        throw ApiError.BadRequest('no acces');
      }

      await order.removeExecutors(candidat);
      req.updates = { status: 'Доступный' };
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrdersRouterMiddleware();
