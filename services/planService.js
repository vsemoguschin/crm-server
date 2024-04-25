const { ManagersPlan, Dealers } = require('../entities/association');
const ApiError = require('../error/apiError');

class PlanService {
  async createDeal(deal) {
    try {
      const { price, createdAt, userId } = deal;

      const period = createdAt.toISOString().slice(0, 7);
      // console.log(1111, period);

      const [monthPlan, created] = await ManagersPlan.findOrCreate({
        where: {
          userId: 2,
          period,
        },
        defaults: {
          plan: 0,
          dealsSales: price,
          dealsAmount: 1,
          userId: 2,
        },
      });

      if (!created) {
        monthPlan.dealsSales += deal.price;
        monthPlan.dealsAmount += 1;
        await monthPlan.save();
      }

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

      const [monthPlan, created] = await ManagersPlan.findOrCreate({
        where: {
          userId: 2,
          period,
        },
        defaults: {
          dopsSales: price,
          dopsAmount: 1,
          userId: 2,
        },
      });

      if (!created) {
        monthPlan.dopsSales += dop.price;
        monthPlan.dopsAmount += 1;
        await monthPlan.save();
      }

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
  async createPayment(payment) {
    try {
      const { price, createdAt, userId, dealId } = payment;

      const period = createdAt.toISOString().slice(0, 7);
      // console.log(1111, period);

      const [monthPlan, created] = await ManagersPlan.findOrCreate({
        where: {
          userId: 2,
          period,
        },
        defaults: {
          receivedPayments: price,
          userId: 2,
          // main: true,
        },
      });

      if (!created) {
        monthPlan.receivedPayments += payment.price;
        await monthPlan.save();
      }

      const [managerPlan, newPlan] = await ManagersPlan.findOrCreate({
        where: {
          userId,
          period,
        },
        defaults: {
          receivedPayments: price,
          userId,
        },
      });

      if (!newPlan) {
        managerPlan.receivedPayments += payment.price;
        await managerPlan.save();
      }
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
