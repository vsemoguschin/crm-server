const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: ordersModelFields, Order } = require('./ordersModel');
const { User, WorkSpace, Preorder } = require('../association');
const { Op } = require('sequelize');
const { Neon, modelFields: neonsModelFields } = require('../neons/neonsModel');

const frontOptions = {
  modelFields: modelsService.getModelFields(ordersModelFields),
};
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class OrdersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      // console.log(req.body.neons);
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      // if (!permissions.includes(requesterRole)) {
      //   console.log(false, 'no acces');
      //   throw ApiError.Forbidden('Нет доступа');
      // }
      const newOrder = await modelsService.checkFields([Order, ordersModelFields], req.body);
      const { neons } = req.body;
      if (neons.length > 0) {
        const res = [];
        for (let i = 0; i < neons.length; i++) {
          const neon = await modelsService.checkFields([Neon, neonsModelFields], neons[i]);
          res.push(neon);
        }
        newOrder.neons = res;
      }
      req.newOrder = newOrder;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      // return console.log(req.baseUrl, req.params);
      const { id, orderId } = req.params;
      const order = await Order.findOne({
        where: {
          id: orderId || id,
        },
        include: ['stage', 'neons', 'master', 'packer', 'frezer', 'laminater'],
      });
      if (!order) {
        throw ApiError.NotFound('Order not found');
      }
      req.order = order;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    const searchFields = ['name'];
    try {
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      let searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          ...searchFilter,
        },
      };
      if (req.baseUrl.includes('/deals')) {
        searchParams = {
          where: { dealId: req.params.id, ...searchFilter },
          include: ['neons', 'stage'],
        };
      }
      if (req.baseUrl.includes('/deliveries')) {
        const { delivery } = req;
        searchParams = {
          where: { deliveryId: delivery.id, ...searchFilter },
          include: ['stage'],
        };
      }
      if (req.baseUrl.includes('/users')) {
        const { user } = req;
        searchParams = {
          where: { userId: user.id, ...searchFilter },
          include: ['stage'],
        };
      }
      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }
  async changeStage(req, res, next) {
    const stageAccess = {
      ['ADMIN']: [1, 2, 3, 4, 5],
      ['G']: [1, 2, 3, 4, 5],
      ['DP']: [1, 2, 3, 4, 5],
      ['RP']: [1, 2, 3, 4, 5],
      ['FRZ']: [1],
      ['LAM']: [2],
      ['MASTER']: [3],
      ['PACKER']: [4],
    };
    try {
      const requesterRole = req.requester.role;
      const { stage, order } = req;
      const updates = { status: 'Доступен' };
      console.log(order.stageId);
      if (!stageAccess[requesterRole].includes(order.stageId)) {
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!order.executors.find((user) => user.id === req.requester.id) && !['ADMIN', 'G', 'DP', 'RP'].includes(requesterRole)) {
        throw ApiError.Forbidden('Нет доступа');
      }
      if (['ADMIN', 'G', 'DP', 'RP'].includes(requesterRole)) {
        updates.stageId = stage.id;
      }
      if (['FRZ', 'LAM', 'MASTER', 'PACKER'].includes(requesterRole)) {
        updates.stageId = order.stageId + 1;
      }
      if (updates.stageId == 2 && order.laminate == '') {
        updates.stageId = 3;
      }
      if (updates.stageId === 5) {
        updates.status = 'Выполнен';
      }
      if (updates.stageId === order.stageId) {
        throw ApiError.BadRequest('у заказа уже этот стейдж');
      }
      await order.update(updates);
      return res.status(200).json(200);
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
      const requesterRole = req.requester.role;
      if (!workStages[requesterRole]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const { order, user: candidat } = req;
      const roleStage = workStages[requesterRole];
      const workSpace = await WorkSpace.findOne({
        include: [
          {
            model: User,
            as: 'members',
            // attributes: ['id'],
            where: { id: candidat.id },
            include: 'role',
          },
          {
            model: Order,
            where: {
              id: order.id,
              status: 'Доступен',
              stageId: roleStage,
            },
          },
        ],
      });

      // return res.json({workSpace.orders[0].executors, workSpace.members});
      if (!workSpace) {
        console.log(false, 'no access');
        throw ApiError.BadRequest('no access');
      }
      if (order.executors.find((executor) => executor.role.shortName === candidat.role.shortName)) {
        throw ApiError.BadRequest('Уже назначен исполнитель с такой ролью');
      }
      // return console.log(workSpace.members[0]);
      await order.addExecutors(workSpace.members[0]);
      await order.update({ status: 'В работе' });
      return res.status(200).json(200);
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
      const requesterRole = req.requester.role;
      if (!workStages[requesterRole]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const orderid = req.params.id;
      const candidat = req.params.userId;
      const roleStage = workStages[requesterRole];

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
      await order.update({ status: 'Доступен' });
      return res.status(200).json(200);
    } catch (e) {
      next(e);
    }
  }
  async preorders(req, res, next) {
    try {
      const preorders = await Preorder.findAll({
        where: {
          status: 'new',
        },
      });
      req.preorders = preorders;
      return res.json(preorders);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrdersRouterMiddleware();
