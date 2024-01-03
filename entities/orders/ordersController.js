const uuid = require('uuid');
const path = require('path');
const { Order, DraftOrderAssociation, Stage, User, UserOrderAssociation, OrderUserAssociation } = require('../association');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const fs = require('fs');
const { Op } = require('sequelize');

class OrdersController {
  async create(req, res, next) {
    try {
      const { new_order } = req;
      const { preview } = new_order;
      const { img } = req.files;
      const order = await Order.create(new_order, {
        include: [
          {
            association: DraftOrderAssociation,
            as: 'draft',
          },
          OrderUserAssociation,
        ],
      });
      const user = await User.findByPk(req.user.id);

      order.addExecutors(user);

      const filePath = 'orders/' + preview;
      fs.writeFileSync('public/' + filePath, img.data, (err) => {
        if (err) {
          throw ApiError.BadRequest('Wrong');
        }
      });
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
        include: {
          model: Stage,
          as: 'stage',
        },
      };

      const orders = await Order.findAndCountAll(squelizeBody);

      const response = getPaginationData(orders, pageNumber, pageSize, 'orders');
      return res.json(response);
    } catch (e) {
      next(e);
    }
    //сортировка по дате
  }
  async getOne(req, res, next) {
    const order = await Order.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: Stage,
        },
        OrderUserAssociation,
      ],
    });
    res.json(order);
  }
}

module.exports = new OrdersController();
