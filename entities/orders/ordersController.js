const { Order, modelFields: ordersModelFields } = require('./ordersModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Deal } = require('../association');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');

class OrdersController {
  async create(req, res, next) {
    try {
      const { deal, newOrder } = req;
      newOrder.userId = req.requester.id;
      const order = await deal.createOrder(newOrder);
      return res.json(order);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { order } = req;
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];
      const { searchParams } = req;

      const orders = await Order.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(orders, current, pageSize, 'orders');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
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
    try {
      const { order } = req;
      let updates;
      if (req.baseUrl.includes('/orders')) {
        const body = checkRepeatedValues(order, req.body);
        updates = await modelsService.checkUpdates([Order, ordersModelFields], body, updateFields);
      }
      if (req.baseUrl.includes('/workspaces')) {
        updates = req.body;
        await Deal.update(
          {
            status: 'process',
          },
          {
            where: {
              id: order.dealId,
            },
          },
        );
      }
      await order.update(updates);
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { order } = req;
      const deletedOrder = await order.destroy();
      // console.log(deletedOrder);
      if (deletedOrder === 0) {
        console.log('Заказ не удален');
        return res.json('Заказ не удален');
      }
      console.log('Заказ удален');
      return res.json('Заказ удален');
    } catch (e) {
      next(e);
    }
  }

  //просмотр заказов в пространстве
  async stageList(req, res, next) {
    const permissions = {
      ['FRZ']: 1,
      ['LAM']: 2,
      ['MASTER']: 3,
      ['PACKER']: 4,
    };
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    let { status } = req.query;
    try {
      const requesterRole = req.requester.role;
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const searchFields = ['title'];
      const filter = await modelsService.searchFilter(searchFields, req.query);
      const { workSpace, stage } = req;
      if (status === undefined) {
        status = 'Доступен';
      }
      const deals = await Deal.findAndCountAll({
        where: {
          ...filter,
        },
        attributes: ['id', 'title', 'deadline', 'createdAt'],
        include: [
          {
            model: Order,
            where: {
              workSpaceId: workSpace.id,
              stageId: stage.id,
              status: status,
            },
            include: [
              'neons',
              {
                association: 'executors',
                include: ['role'],
              },
              'files',
            ],
            // attributes: ['status'],
          },
          'files',
        ],
        distinct: true,
        limit,
        offset,
        order,
      });
      // console.log(requesterRole, stage.id, status);
      const response = getPaginationData(deals, current, pageSize, 'deals');
      if (permissions[requesterRole] == stage.id && status === 'Доступен') {
        response.action = 'TAKE';
      }
      if (['ADMIN', 'G', 'DP', 'RP'].includes(requesterRole)) {
        response.action = 'MOVE';
      }
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrdersController();
