const { User } = require('../users/usersModel');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');
const { ManagersPlan } = require('./managersModel');

class ManagersController {
  async getOne(req, res, next) {
    try {
      const { manager, period } = req;
      const plan = await ManagersPlan.findOne({ where: { period: period, userId: manager.id } });
      // return console.log(plan);
      if (!plan) {
        throw ApiError.BadRequest('period no found');
      }

      const totalSales = plan.dealsSales + plan.dopsSales;
      const salesToPlan = ((totalSales / plan.plan) * 100).toFixed();
      const remainder = plan.plan - totalSales;
      const dopsToSales = ((plan.dopsSales / totalSales) * 100).toFixed(); //процент допов от продаж

      const result = {
        plan: plan.plan, // план на месяц
        totalSales, // общая сумма продаж
        salesToPlan, // процент продаж от плана(%)
        remainder, // остаток до плана

        recievedPayments: plan.recievedPayments, // выручка(сумма оплат по продажам)
        dopsToSales, //процент допов от продаж
        averageBill: (plan.dealsSales / plan.dealsAmount).toFixed(), //средний чек(продано/колличество заказов)
        dealsAmount: plan.dealsAmount, //колличество сделок

        dealsSales: plan.dealsSales, // сумма сделок
        dopsSales: plan.dopsSales, // сумма допов
      };

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  //получения всех менеджеров по заданным параметрам
  async getList(req, res, next) {
    // get-запрос передаем query параметры
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      const { searchParams } = req;
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const managers = await User.findAll({
        ...searchParams,
        order: [['fullName', 'DESC']],
        // limit,
        // offset,
      });
      // return console.log(managers);
      const datas = [];
      // for (let i = 0; i < managers.length; i++) {
      //   // console.log(managers[i]);
      //   const { fullName, deals, group, managersPlans, membership, dops } = managers[i];
      //   // return console.log(deals);
      //   const payments = deals.map((el) => el.payments);
      //   const dealsSales = deals.reduce(function (acc, obj) {
      //     return acc + obj.price;
      //   }, 0);
      //   console.log(group);
      //   const proceeds =
      //     payments.reduce(function (acc, obj) {
      //       return acc + obj.price;
      //     }, 0) || 0;
      //   const dopsSales =
      //     payments.reduce(function (acc, obj) {
      //       return acc + obj.price;
      //     }, 0) || 0;
      //   const sales = dealsSales + dopsSales;
      //   const managerData = {
      //     fullName: fullName, //ФИО
      //     group: group?.title || '', //группа
      //     workspace: membership[0]?.title || '',
      //     plan: managersPlans[0].plan, //план на месяц
      //     sales: sales, //сумма всех продаж
      //     salesToPlan: ((sales / managersPlans[0].plan) * 100).toFixed() + '%', // процент продаж от плана
      //     proceeds: proceeds, //выручка(сумма оплат по продажам)
      //     remainder: managersPlans[0].plan - sales, // остаток до плана
      //     dops: dopsSales, //сумма допов
      //     dopsToSales: (dopsSales / sales) * 100 + '%', //процент допов от продаж
      //     tg: '', //telega
      //     averageBill: dealsSales / deals.length, //средний чек(продано/колличество заказов)
      //     deals: deals.length, //колличество сделок
      //   };
      //   console.log(managerData);
      // }

      const response = getPaginationData(managers, current, pageSize, 'managers');
      return res.json(managers);
    } catch (e) {
      next(e);
    }
  }

  //установка плана
  async setPlan(req, res, next) {
    try {
      const { manager } = req;
      let { plan } = req.body;
      const { period } = req.body;
      const re = /^(19|20)\d\d-(0[1-9]|1[0-2])$/;

      if (!plan || +plan < 0 || !period) {
        throw ApiError.BadRequest('Забыл что то');
      }
      checkReqQueriesIsNumber({ plan });
      if (!re.test(period)) {
        throw ApiError.BadRequest('wrong period');
      }

      plan = +plan;

      // const period = new Date([year, month].join('-'), '0');
      const [newPlan, created] = await ManagersPlan.findOrCreate({
        where: { period, userId: manager.id },
        defaults: {
          userId: manager.id,
          period,
          plan: +plan,
        },
      });
      if (!created) {
        await newPlan.update({ plan });
      }
      console.log(newPlan, 232424);
      return res.json(newPlan);
    } catch (e) {
      next(e);
    }
  }
  //установка плана
  async setMainPlan(req, res, next) {
    try {
      const { requester } = req;
      if (!['ADMIN', 'G'].includes(requester.role)) {
        throw ApiError.Forbidden('no access');
      }
      let { period, plan } = req.body;
      if (!period || !plan || +plan < 0) {
        throw ApiError.BadRequest('Забыл что то');
      }
      checkReqQueriesIsNumber({ plan });
      plan = +plan;
      const [newPlan, created] = await ManagersPlan.findOrCreate({
        where: { period },
        defaults: {
          userId: 2,
          period,
          plan: +plan,
        },
      });
      if (!created) {
        await newPlan.update({ plan });
      }

      return res.json(newPlan);
    } catch (e) {
      next(e);
    }
  }
}


module.exports = new ManagersController();
