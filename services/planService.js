const { ManagersPlan, Dealers, Deal } = require('../entities/association');
const ApiError = require('../error/apiError');

class PlanService {
  async createDeal(deal) {
    try {
      const { price, createdAt, userId } = deal;

      const period = createdAt.toISOString().slice(0, 7);
      // console.log(1111, period);

      const [managerPlan, newPlan] = await ManagersPlan.findOrCreate({
        where: {
          userId,
          period,
        },
        defaults: {
          plan: 0,
          dealsSales: price,
          dealsAmount: 1,
          userId,
        },
      });

      if (!newPlan) {
        managerPlan.dealsSales += deal.price;
        managerPlan.dealsAmount += 1;
        await managerPlan.save();
      }
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async updateDeal(deal, newPrice) {
    try {
      const { createdAt, dealers } = deal;
      // console.log(createdAt, dealers, 12121);

      const period = createdAt.toISOString().slice(0, 7);
      // return
      const firstDealerPart = dealers[0].dealUsers.part;
      const firstDealerNewPrice = +(firstDealerPart * newPrice).toFixed();
      dealers.forEach(async (dealer, i) => {
        const { dealUsers } = dealer;
        const { price: oldPrice, userId } = dealUsers;
        const dealerNewPrice = i == 0 ? firstDealerNewPrice : newPrice - firstDealerNewPrice;
        // return console.log(dealer, dealUsers, oldPrice, firstDealerNewPrice, 11111);

        //часть диллера(сумма)
        dealUsers.price = dealerNewPrice;
        await dealUsers.save();

        //план диллера
        const dealerPlan = await ManagersPlan.findOne({
          where: {
            userId,
            period,
          },
        });
        dealerPlan.dealsSales -= oldPrice;
        dealerPlan.dealsSales += dealerNewPrice;
        await dealerPlan.save();
      });
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async deleteDeal(deal) {
    try {
      const { createdAt, price, payments, dops } = deal;

      const period = createdAt.toISOString().slice(0, 7);

      const dealers = deal.dealers.map((d) => d.dealUsers);
      const dealPayments = payments.reduce((a, b) => a + b.price, 0);

      const firstDealerPart = dealers[0].part;
      const firstDealerDealPrice = +(firstDealerPart * price).toFixed();
      const firstDealerPaymentPrice = +(firstDealerPart * dealPayments).toFixed();
      console.log(112121, dealPayments, firstDealerPart, firstDealerDealPrice, firstDealerPaymentPrice);
      dealers.forEach(async (dealer, i) => {
        //часть диллера(сумма)
        const dealerDealPrice = i == 0 ? firstDealerDealPrice : price - firstDealerDealPrice;
        const dealerPaymentsPrice = i == 0 ? firstDealerPaymentPrice : dealPayments - firstDealerPaymentPrice;

        console.log(dealerDealPrice, dealerPaymentsPrice, 3232342);

        //план диллера
        const dealerPlan = await ManagersPlan.findOne({
          where: {
            userId: dealer.userId,
            period,
          },
        });
        dealerPlan.dealsSales -= dealerDealPrice;
        dealerPlan.receivedPayments -= dealerPaymentsPrice;
        dealerPlan.dealsAmount -= 1;
        await dealerPlan.save();
        await dealer.destroy();
      });
      console.log('plans updated', 324242);

      //Удаление платежей сделки
      await Promise.all(
        payments.map(async (payment) => {
          await payment.destroy();
        }),
      );
      console.log('payments deleted', 324242);

      //Удаление допов сделки
      await Promise.all(
        dops.map(async (dop) => {
          const { price, createdAt } = dop;
          const period = createdAt.toISOString().slice(0, 7);

          const dealerPlan = await ManagersPlan.findOne({
            where: {
              userId: dop.userId,
              period,
            },
          });
          dealerPlan.dopsSales -= price;
          dealerPlan.dopsAmount -= 1;
          await dealerPlan.save();
          await dop.destroy();
        }),
      );
      console.log('dops deleted', 324242);

      // return console.log(dealers);
      return;
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async createDop(dop) {
    try {
      const { price, createdAt, userId } = dop;

      const period = createdAt.toISOString().slice(0, 7);
      // console.log(1111, period);

      const [managerPlan, newPlan] = await ManagersPlan.findOrCreate({
        where: {
          userId,
          period,
        },
        defaults: {
          plan: 0,
          dopsSales: price,
          dopsAmount: 1,
          userId,
        },
      });

      if (!newPlan) {
        managerPlan.dopsSales += dop.price;
        managerPlan.dopsAmount += 1;
        await managerPlan.save();
      }
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async updateDop(dop, newPrice) {
    try {
      const { createdAt } = dop;

      const period = createdAt.toISOString().slice(0, 7);

      const dealerPlan = await ManagersPlan.findOne({
        where: {
          userId: dop.userId,
          period,
        },
      });
      dealerPlan.dopsSales += newPrice - dop.price;
      await dealerPlan.save();
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async deleteDop(dop) {
    try {
      const { createdAt } = dop;

      const period = createdAt.toISOString().slice(0, 7);

      const dealerPlan = await ManagersPlan.findOne({
        where: {
          userId: dop.userId,
          period,
        },
      });
      dealerPlan.dopsSales -= dop.price;
      dealerPlan.dopsAmount -= 1;
      await dealerPlan.save();
      return;
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async createPayment(payment, dealCreatedAt) {
    try {
      const { price, dealId } = payment;

      const period = dealCreatedAt.toISOString().slice(0, 7);

      const dealers = await Dealers.findAll({
        where: {
          dealId,
        },
      });
      const firstDealerPart = dealers[0].part;
      const firstDealerPrice = +(firstDealerPart * price).toFixed();
      dealers.forEach(async (dealer, i) => {
        //часть диллера(сумма)
        const dealerPrice = i == 0 ? firstDealerPrice : price - firstDealerPrice;

        //план диллера
        const dealerPlan = await ManagersPlan.findOne({
          where: {
            userId: dealer.userId,
            period,
          },
        });
        dealerPlan.receivedPayments += dealerPrice;
        await dealerPlan.save();

        dealer.payments += dealerPrice;
        await dealer.save();
      });
      // return console.log(dealers);
      return;
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async deletePayment(payment) {
    try {
      const { price, dealId } = payment;

      const deal = await Deal.findOne({
        where: {
          id: dealId,
        },
        include: ['dealers'],
      });

      const period = deal.createdAt.toISOString().slice(0, 7);

      const dealers = deal.dealers.map((d) => d.dealUsers);

      //часть сделки
      const firstDealerPart = dealers[0].part;
      const firstDealerPaymentPrice = +(firstDealerPart * price).toFixed();
      dealers.forEach(async (dealer, i) => {
        //часть диллера(сумма)
        const dealerPrice = i == 0 ? firstDealerPaymentPrice : price - firstDealerPaymentPrice;

        //план диллера
        const dealerPlan = await ManagersPlan.findOne({
          where: {
            userId: dealer.userId,
            period,
          },
        });
        dealerPlan.receivedPayments -= dealerPrice;
        await dealerPlan.save();

        dealer.payments -= dealerPrice;
        await dealer.save();
      });
      // return console.log(dealers);
      return;
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
}

module.exports = new PlanService();
