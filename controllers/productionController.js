const { Deal } = require('../entities/deals/dealsModel');
const getPagination = require('../utils/getPagination');

class ProductionController {
  async getListOfOrders(req, res, next) {
    try {
      const { searchParams, pageSize, current } = req;
      //   console.log(req);
      const { limit } = getPagination(current, pageSize);

      const deals = await Deal.findAndCountAll({
        ...searchParams,
        distinct: true,
        order: [['deadline', 'ASC']],
      });
      // console.log(deals.rows[0]);
      const dealsList = deals.rows.map((el) => {
        const { id } = el;
        const title = el.title; //Название
        const status = el.status;
        const createdAt = el.createdAt.toISOString().slice(0, 10);
        const card_id = el.card_id;
        const deadline = el.deadline;
        const orders = el.orders || [];
        const files = el.files || [];
        const deliveries = el.deliveries || [];
        const chatLink = el.client.chatLink || '';
        // console.log(card_id, 34424);
        // console.log(createdAt.toISOString().slice(0, 10), 234356);

        return {
          id,
          title,
          status,
          createdAt,
          card_id,
          deadline,
          orders,
          deliveries,
          files,
          chatLink,
        };
      });

      const arrayOffset = (current || 1) * (pageSize || 10); // сколько пропустить
      const arrayStart = arrayOffset - limit; //начало
      const arrayEnd = arrayStart + (pageSize || 100); //end

      const resp = {
        total: dealsList.length,
        deals: dealsList.slice(arrayStart, arrayEnd),
        totalPages: Math.ceil(dealsList.length / limit),
        current: current ? +current : 0,
      };
      // console.log(dealsList[0].orders, req.params.stageId, 2132434);

      return res.json(resp);
    } catch (e) {
      next(e);
    }
  }
  async getListOfPreorders(req, res, next) {
    try {
      const { searchParams, pageSize, current } = req;
      //   console.log(req);
      const { limit } = getPagination(current, pageSize);

      const deals = await Deal.findAndCountAll({
        ...searchParams,
        distinct: true,
        order: [['createdAt', 'DESC']],
      });

      const dealsList = deals.rows.map((el) => {
        const { id } = el;
        const title = el.title; //Название
        // const chatLink = el.client.chatLink;
        const status = el.status;
        const delivery = el.deliveries; //полностью
        const createdAt = el.createdAt.toISOString().slice(0, 10);
        const preorder = el.preorder;
        const deadline = el.deadline;
        const orders = el.orders;
        // console.log(createdAt.toISOString().slice(0, 10), 234356);

        return {
          id,
          title,
          status,
          delivery,
          // chatLink,
          createdAt,
          preorder,
          deadline,
          orders,
        };
      });

      const arrayOffset = (current || 1) * (pageSize || 10); // сколько пропустить
      const arrayStart = arrayOffset - limit; //начало
      const arrayEnd = arrayStart + (pageSize || 100); //end

      const resp = {
        total: dealsList.length,
        deals: dealsList.slice(arrayStart, arrayEnd),
        totalPages: Math.ceil(dealsList.length / limit),
        current: current ? +current : 0,
      };
      // console.log(dealsList[0].orders, 2132434);

      return res.json(resp);
    } catch (e) {
      next(e);
    }
  }
  async updateStatus(req, res, next) {
    try {
      console.log(req);
    } catch (e) {
      next(e);
    }
  }
  async getDeal(req, res, next) {
    try {
      const { deal } = req;
      // console.log(deal.orders);
      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductionController();
