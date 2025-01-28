const { Op } = require('sequelize');
const checkReqQueriesIsNumber = require('../checking/checkReqQueriesIsNumber');
const modelsService = require('../services/modelsService');
const { Order, Deal, Delivery, User, Role, Client, File } = require('../entities/association');
const ApiError = require('../error/apiError');
const { stages, orderUsers, orderStages } = require('../entities/orders/ordersModel');
const { title } = require('process');

class ProductionRouterMiddleware {
  async getListOfOrders(req, res, next) {
    try {
      // const requesterRole = req.requester.role;
      const { pageSize, current, key, order } = req.query;
      checkReqQueriesIsNumber({ pageSize, current });

      const sortFilter = {
        apply: key && order ? true : false,
        order: ['DESC', 'ASC'].includes(order) ? order : 'DESC',
      };

      // console.log(searchFilter, 3232092049);
      const { stageId } = req.params;
      const stageDealsParams = {
        include: [
          {
            model: Order,
            where: {
              stageId,
            },
            include: [
              {
                model: File,
                include: ['user'],
              },
            ],
          },
        ],
      };
      // Выполняем первый запрос для получения нужных `deals`
      const dealsWithOrders = await Deal.findAll(stageDealsParams);

      // Получаем ID всех найденных сделок
      const dealIds = dealsWithOrders.map((deal) => deal.id);
      // console.log(stage);
      const searchParams = {
        where: {
          id: dealIds,

          //   createdAt: {
          //     [Op.gt]: '2000-01-01',
          //     [Op.lt]: '2500-01-01',
          //   },
        },
        include: [
          'preorder',
          'files',
          'deliveries',
          'client',
          {
            model: Order,
            include: [
              {
                model: File,
                include: ['user'],
              },
              'neons',
              'master',
              'packer',
              'frezer',
              'laminater',
            ],
          },
        ],
      };
      // return console.log(searchParams.include);
      req.searchParams = searchParams;
      req.stageDealsParams = stageDealsParams;
      req.sortFilter = sortFilter;
      req.pageSize = pageSize;
      req.current = current;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getListOfOrdersBySearch(req, res, next) {
    try {
      // const requesterRole = req.requester.role;
      const { pageSize, current, title } = req.query;
      console.log(title, 21311);
      checkReqQueriesIsNumber({ pageSize, current });

      const searchParams = {
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${title}%` } }, // Поиск по title
            { '$client.chatLink$': { [Op.like]: `%${title}%` } }, // Поиск по client.chatLink
            { '$deliveries.track$': { [Op.like]: `%${title}%` } }, // Поиск по deliveries.track
          ],
        },
        include: [
          {
            model: Client,
            as: 'client', // Убедитесь, что алиас совпадает с ассоциацией
          },
          'preorder',
          {
            model: Delivery,
            as: 'deliveries', // Убедитесь, что алиас совпадает с ассоциацией
          },
          {
            model: File,
            include: ['user'],
          },
          {
            model: Order,
            include: [
              {
                model: File,
                include: ['user'],
              },
              'neons',
            ],
          },
        ],
      };

      // const searchParams = {
      //   where: {
      //     title: { [Op.like]: `%${title}%` },
      //   },
      //   include: [
      //     'preorder',
      //     'files',
      //     'deliveries',
      //     'client',
      //     {
      //       model: Order,
      //       include: ['files', 'neons'],
      //     },
      //   ],
      // };
      req.searchParams = searchParams;
      req.pageSize = pageSize;
      req.current = current;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getListOfPreorders(req, res, next) {
    try {
      //   const requesterRole = req.requester.role;

      const { pageSize, current, key, order } = req.query;
      checkReqQueriesIsNumber({ pageSize, current });

      const keys = ['price', 'dopsPrice', 'payments', 'totalPrice', 'remainder'];

      const sortFilter = {
        apply: key && order ? true : false,
        key: keys.includes(key) ? key : null,
        order: ['DESC', 'ASC'].includes(order) ? order : 'DESC',
      };

      // console.log(searchFilter, 3232092049);
      const searchParams = {
        where: {
          id: { [Op.gt]: 0 },
          status: 'Создана',
          createdAt: {
            [Op.gt]: '2000-01-01',
            [Op.lt]: '2500-01-01',
          },
        },
        include: ['preorder', 'orders'],
      };

      req.searchParams = searchParams;
      req.sortFilter = sortFilter;
      req.pageSize = pageSize;
      req.current = current;
      next();
    } catch (e) {
      next(e);
    }
  }
  async updateStatus(req, res, next) {
    try {
      // return console.log(req.requester.id);
      const { deal } = req;
      const { orders } = deal;
      if (deal.status === 'Создана' && deal.orders.length === 0) {
        throw ApiError.BadRequest('Нельзя изменять статус сделки, если нет заказов');
      }
      for (let i = 0; i < orders.length; i++) {
        await orders[i].update({ stageId: 2 });
      }
      await deal.update({ status: 'Изготовление' });

      return res.status(200).json('Заказы отправлены на изготовление');
    } catch (e) {
      next(e);
    }
  }
  async getDeal(req, res, next) {
    try {
      const { id } = req.params;
      const deal = await Deal.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Delivery,
            // include: ['orders'],
          },
          'dealDate',
          'files',
          'client',
          // 'preorder',
          {
            model: Order,
            include: ['stage', 'neons', 'master', 'frezer', 'packer', 'laminater'],
          },
        ],
      });
      if (!deal) {
        throw ApiError.NotFound('Deal not found');
      }
      // console.log(deal.orders, 924782);
      // console.log(deal, 4242);
      req.deal = deal;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getWorkers(req, res, next) {
    try {
      // const { id } = req.params;
      const workers = await User.findAll({
        include: [
          {
            model: Role,
            where: {
              shortName: ['MASTER', 'FRZ', 'LAM', 'PACKER'],
            },
          },
        ],
      });
      // console.log(deal.orders, 924782);
      // console.log(deal, 4242);
      req.workers = workers;

      return res.json(workers);
    } catch (e) {
      next(e);
    }
  }
  async getDeliveries(req, res, next) {
    try {
      const { status } = req.query;
      // console.log(req, 213131);
      const deliveries = await Delivery.findAll({
        where: {
          status,
        },
      });
      // console.log(deal.orders, 924782);
      // console.log(deal, 4242);
      req.deliveries = deliveries;

      return res.json(deliveries);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductionRouterMiddleware();
