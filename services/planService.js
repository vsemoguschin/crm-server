const { ManagersPlan, Dealers } = require('../entities/association');
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
      const { createdAt } = deal;

      const period = createdAt.toISOString().slice(0, 7);

      const monthPlan = await ManagersPlan.findOne({
        where: {
          userId: 2,
          period,
        },
      });
      monthPlan.dealsSales += newPrice - deal.price;
      await monthPlan.save();

      const dealer = await Dealers.findOne({ where: { dealId: deal.id } });
      await dealer.update({ price: newPrice });

      const dealerPlan = await ManagersPlan.findOne({
        where: {
          userId: dealer.userId,
          period,
        },
      });
      dealerPlan.dealsSales += newPrice - deal.price;
      await dealerPlan.save();
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async deleteDeal(deal) {
    try {
      const { createdAt } = deal;

      const period = createdAt.toISOString().slice(0, 7);

      const monthPlan = await ManagersPlan.findOne({
        where: {
          userId: 2,
          period,
        },
      });
      monthPlan.dealsSales -= deal.price;
      monthPlan.dealsAmount -= 1;
      await monthPlan.save();

      const dealer = await Dealers.findOne({ where: { dealId: deal.id } });

      const dealerPlan = await ManagersPlan.findOne({
        where: {
          userId: dealer.userId,
          period,
        },
      });
      dealerPlan.dealsSales -= deal.price;
      dealerPlan.dealsAmount -= 1;
      await dealerPlan.save();
      await dealer.destroy();
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

      const monthPlan = await ManagersPlan.findOne({
        where: {
          userId: 2,
          period,
        },
      });
      monthPlan.dopsSales += newPrice - dop.price;
      await monthPlan.save();

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

      const monthPlan = await ManagersPlan.findOne({
        where: {
          userId: 2,
          period,
        },
      });
      monthPlan.dopsSales -= dop.price;
      monthPlan.dopsAmount -= 1;
      await monthPlan.save();

      const dealerPlan = await ManagersPlan.findOne({
        where: {
          userId: dop.userId,
          period,
        },
      });
      dealerPlan.dopsSales -= dop.price;
      dealerPlan.dopsAmount -= 1;
      await dealerPlan.save();
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
  async createPayment(payment, dealCreatedAt) {
    try {
      const { price, userId, dealId } = payment;

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
  async updatePayment(payment, newPrice) {
    try {
      const { createdAt } = payment;

      const period = createdAt.toISOString().slice(0, 7);

      const monthPlan = await ManagersPlan.findOne({
        where: {
          userId: 2,
          period,
        },
      });
      monthPlan.receivedPayments += newPrice - payment.price;
      await monthPlan.save();

      const dealerPlan = await ManagersPlan.findOne({
        where: {
          userId: pa.userId,
          period,
        },
      });
      dealerPlan.dopsSales += newPrice - dop.price;
      await dealerPlan.save();
    } catch (e) {
      throw ApiError.BadRequest(e);
    }
  }
}

module.exports = new PlanService();
