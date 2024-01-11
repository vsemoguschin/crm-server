const uuid = require('uuid');
const path = require('path');
const { Order, DraftOrderAssociation, Stage, User, UserOrderAssociation, OrderUserAssociation } = require('../association');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const fs = require('fs');
const { Op } = require('sequelize');
const removeNotAllowedFields = require('../../utils/removeNotAllowedFields');
const { log } = require('console');

class OrdersController {
  async create(req, res, next) {
    try {
      const { newOrder } = req;
      const { img } = req.files;
      const order = await Order.create(newOrder, {
        include: [
          {
            association: DraftOrderAssociation,
            as: 'draft',
          },
          OrderUserAssociation,
        ],
      });
      // const user = await User.findByPk(req.user.id);

      await order.addExecutors([1]);

      const previewPath = 'public/orders/id' + order.id + newOrder.previewFormat;
      order.preview = previewPath;
      order.save();
      img.mv(path.resolve(previewPath));
      // fs.writeFileSync('public/' + filePath, img.data, (err) => {
      //   if (err) {
      //     throw ApiError.BadRequest('Wrong');
      //   }
      // });
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
      fieldSearch,
      fieldSearchValue,
    } = req.query;
    const requesterId = req.user.id;
    const { limit, offset } = getPagination(pageNumber, pageSize);

    try {
      const order = queryOrder ? [[key, queryOrder]] : [['createdAt', 'DESC']];

      const whereFilters = fieldSearch
        ? {
            [fieldSearch]: {
              [Op.iRegexp]: fieldSearchValue,
            },
          }
        : {};

      const whereDeals = {
        dealId: fieldSearchValue,
      };

      const squelizeBody = {
        where: fieldSearch === 'dealId' ? whereDeals : whereFilters,
        order,
        limit,
        offset,
        include: ['stage', 'executors'],
      };

      const orders = await Order.findAndCountAll(squelizeBody);

      const response = getPaginationData(orders, pageNumber, pageSize, 'orders');
      return res.json(response);
    } catch (e) {
      return res.status(400).json(e);
    }
    //сортировка по дате
  }
  async getOne(req, res, next) {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Stage,
        },
        OrderUserAssociation,
      ],
    });
    res.json(order);
  }
  async update(req, res, next) {
    const img = req.files?.img;
    const data = req.newOrder;
    const updateData = removeNotAllowedFields(data, [
      'name',
      'preview',
      'description',
      'stageId',
      'trackNumber',
      'count',
      'dimer',
      'laminate',
      'smart',
      'paidDelivery',
      'street',
      'backlight',
      'acrylic',
      'material',
      'holeType',
      'fittings',
      'wireLength',
      'neonWidth',
      'neonLength',
      'boardWidth',
      'boardHeight',
      'deliveryInfo',
      'deliveryType',
    ]);

    await Order.findOne({
      where: { id: req.params.id },
    }).then(async (res) => {
      if (res.preview && img) {
        fs.rm(path.resolve('public/orders/' + res.preview), (error) => {
          console.log(error);
        });
      }
      if (!updateData.preview) delete updateData.preview;

      Object.assign(res, updateData);
      res.save();
      if (img) img.mv(path.resolve('public/orders/' + data.preview));
    });

    return res.json('ok');
  }
}

module.exports = new OrdersController();
