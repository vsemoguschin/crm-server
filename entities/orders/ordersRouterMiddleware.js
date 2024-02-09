const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: ordersModelFields, Order } = require('./ordersModel');
const { Deal, Stage } = require('../association');

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
      const newOrder = await modelsService.checkFields(ordersModelFields, req.body);
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
  async changeStage(req, res, next) {
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
}
module.exports = new OrdersRouterMiddleware();
