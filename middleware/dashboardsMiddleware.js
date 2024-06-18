const { Op } = require('sequelize');
const checkReqQueriesIsNumber = require('../checking/checkReqQueriesIsNumber');
const { WorkSpace, Group, User, Role, ManagersPlan } = require('../entities/association');
const ApiError = require('../error/apiError');

class dashboardsMiddleware {
  async deals(req, res, next) {
    const searchFields = [
      'title',
      'status',
      'clothingMethod',
      'source',
      'adTag',
      'discont',
      'sphere',
      'city',
      'region',
      'cardLink',
      'paid',
      'clientType',
      'chatLink',
      'workspace',
      'workspaceId',
    ];

    try {
      const requesterRole = req.requester.role;
      const { requester } = req;
      //сделать разрешения

      const workspacesSearch = {
        id: {
          [Op.gt]: 0,
        },
      };
      const groupsSearch = {
        workSpaceId: {
          [Op.gt]: 0,
        },
      };
      if (['MOP', 'ROP'].includes(requesterRole)) {
        workspacesSearch.id = requester.workSpaceId;
        groupsSearch.workSpaceId = requester.workSpaceId;
      }

      const workspaces = await WorkSpace.findAll({
        where: workspacesSearch,
        include: ['groups', 'users'],
      });

      const groups = await Group.findAll({
        where: groupsSearch,
      });
      // console.log(groups, groupsSearch, 32454);

      const managers = await User.findAll({
        include: [
          {
            model: WorkSpace,
            where: workspacesSearch,
          },
        ],
        paranoid: false,
      });
      // console.log(managers);
      return res.json({ workspaces, groups, managers });
    } catch (e) {
      next(e);
    }
  }
  async workspaces(req, res, next) {
    try {
      const { requester } = req;
      if (!['ADMIN', 'G', 'KD', 'DO', 'ROD'].includes(requester.role)) {
        throw ApiError.BadRequest('no access');
      }
      const workspacesSearch = {
        id: {
          [Op.gt]: 0,
        },
      };
      if (['MOP', 'DIZ'].includes(requester.role)) {
        throw ApiError.BadRequest('no access');
      }
      if (['MOP', 'ROP', 'DO', 'ROD'].includes(requester.role)) {
        workspacesSearch.id = requester.workSpaceId;
      }
      const workspaces = await WorkSpace.findAll({
        where: {
          // department: 'COMMERCIAL',
          ...workspacesSearch,
        },
        include: [
          {
            model: Group,
            attributes: ['id', 'title'],
            include: [
              {
                model: User,
                attributes: ['id', 'fullName', 'tg', 'deletedAt'],
                paranoid: false,
                include: [
                  {
                    model: Role,
                    attributes: ['id', 'shortName', 'fullName'],
                  },
                ],
              },
            ],
          },
        ],
        attributes: ['id', 'title'],
        distinct: true,
        order: [['createdAt', 'DESC']],
      });

      return res.json(workspaces);
    } catch (e) {
      next(e);
    }
  }
  async managers(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      console.log(requesterRole);
      if (!['ADMIN', 'G', 'KD', 'DO'].includes(requesterRole)) {
        throw ApiError.BadRequest('no access');
      }
      const { period: req_period } = req.query;
      console.log(req_period, 42353);
      if (!req_period) {
        throw ApiError.BadRequest('Invalid Date');
      }
      const { requester } = req;
      //сделать разрешения

      const workspacesSearch = {
        id: {
          [Op.gt]: 0,
        },
      };
      const groupsSearch = {
        id: {
          [Op.gt]: 0,
        },
      };
      if (['MOP', 'ROP'].includes(requesterRole)) {
        workspacesSearch.id = requester.workSpaceId;
        groupsSearch.id = requester.groupId;
      }

      let workspaces = await WorkSpace.findAll({
        where: workspacesSearch,
        // include: ['groups', 'users'],
      });

      let groups = await Group.findAll({
        where: groupsSearch,
      });
      console.log(groups, groupsSearch, 32454);

      const managers = await User.findAll({
        include: [
          {
            model: WorkSpace,
            where: workspacesSearch,
          },
          {
            model: Group,
            where: groupsSearch,
          },
        ],
        paranoid: false,
      });
      console.log(managers);

      const managersPlans = await Promise.all(
        managers.map(async (m) => {
          // console.log(m.managersPlans[0], 898898);

          const [mPlan] = await ManagersPlan.findOrCreate({
            where: {
              userId: m.id,
              period: req_period,
            },
            defaults: {
              userId: m.id,
              period: req_period,
            },
          });

          const { id, plan, period, dealsSales, dealsAmount, dopsSales, dopsAmount, receivedPayments } = mPlan;
          // console.log(mPlan, mPlan.period, period);

          const totalSales = dealsSales + dopsSales;
          const salesToPlan = plan ? +((totalSales / plan) * 100).toFixed() : 0;
          const remainder = plan - totalSales;
          const dopsToSales = +((dopsSales / totalSales) * 100).toFixed() || 0; //процент допов от продаж

          const result = {
            id: id,
            managerId: m.id,
            groupId: m.groupId,
            workSpaceId: m.workSpaceId,
            fullName: m.fullName,
            period,
            plan, // план на месяц
            totalSales, // общая сумма продаж
            salesToPlan, // процент продаж от плана(%)
            remainder, // остаток до плана

            receivedPayments, // выручка(сумма оплат по продажам)
            averageBill: +(dealsSales / dealsAmount).toFixed() || 0, //средний чек(продано/колличество заказов)

            dealsSales, // сумма сделок
            dealsAmount, //колличество сделок

            dopsSales, // сумма допов
            dopsToSales, //процент допов от продаж
            dopsAmount, //колличество допов
          };
          // console.log(result);
          return result;
        }),
      );

      const getMainPlan = () => {
        const plan = managersPlans.reduce((a, b) => a + b.plan, 0);
        const totalSales = managersPlans.reduce((a, b) => a + b.totalSales, 0);
        const dealsSales = managersPlans.reduce((a, b) => a + b.dealsSales, 0);
        const dealsAmount = managersPlans.reduce((a, b) => a + b.dealsAmount, 0);

        const salesToPlan = plan ? +((totalSales / plan) * 100).toFixed() : 0;
        const dopsSales = managersPlans.reduce((a, b) => a + b.dopsSales, 0);
        const dopsToSales = +((dopsSales / totalSales) * 100).toFixed();

        return {
          period: req_period,
          plan,
          totalSales,
          salesToPlan,
          remainder: managersPlans.reduce((a, b) => a + b.remainder, 0),
          receivedPayments: managersPlans.reduce((a, b) => a + b.receivedPayments, 0),
          dealsSales,
          dealsAmount,
          dopsSales,
          dopsToSales,
          averageBill: +(dealsSales / dealsAmount).toFixed(),
          dopsAmount: managersPlans.reduce((a, b) => a + b.dopsAmount, 0),
        };
      };

      workspaces = workspaces.map((workspace) => {
        const plans = managersPlans.filter((p) => p.workSpaceId === workspace.id);
        const plan = plans.reduce((a, b) => a + b.plan, 0);
        const totalSales = plans.reduce((a, b) => a + b.totalSales, 0);
        const dealsSales = plans.reduce((a, b) => a + b.dealsSales, 0);
        const dealsAmount = plans.reduce((a, b) => a + b.dealsAmount, 0);

        const salesToPlan = plan ? +((totalSales / plan) * 100).toFixed() : 0;
        const dopsSales = plans.reduce((a, b) => a + b.dopsSales, 0);
        const dopsToSales = +((dopsSales / totalSales) * 100).toFixed();

        return {
          id: workspace.id,
          title: workspace.title,
          period: req_period,
          plan,
          totalSales,
          salesToPlan,
          remainder: plans.reduce((a, b) => a + b.remainder, 0),
          receivedPayments: plans.reduce((a, b) => a + b.receivedPayments, 0),
          dealsSales,
          dealsAmount,
          dopsSales,
          dopsToSales,
          averageBill: +(dealsSales / dealsAmount).toFixed(),
          dopsAmount: plans.reduce((a, b) => a + b.dopsAmount, 0),
        };
      });

      groups = groups.map((group) => {
        const plans = managersPlans.filter((p) => p.groupId === group.id);
        const plan = plans.reduce((a, b) => a + b.plan, 0);
        const totalSales = plans.reduce((a, b) => a + b.totalSales, 0);
        const dealsSales = plans.reduce((a, b) => a + b.dealsSales, 0);
        const dealsAmount = plans.reduce((a, b) => a + b.dealsAmount, 0);

        const salesToPlan = plan ? +((totalSales / plan) * 100).toFixed() : 0;
        const dopsSales = plans.reduce((a, b) => a + b.dopsSales, 0);
        const dopsToSales = +((dopsSales / totalSales) * 100).toFixed();

        return {
          id: group.id,
          title: group.title,
          workSpaceId: group.workSpaceId,
          period: req_period,
          plan,
          totalSales,
          salesToPlan,
          remainder: plans.reduce((a, b) => a + b.remainder, 0),
          receivedPayments: plans.reduce((a, b) => a + b.receivedPayments, 0),
          dealsSales,
          dealsAmount,
          dopsSales,
          dopsToSales,
          averageBill: +(dealsSales / dealsAmount).toFixed(),
          dopsAmount: plans.reduce((a, b) => a + b.dopsAmount, 0),
        };
      });

      const mainPlan = getMainPlan();

      return res.json({ groups, workspaces, managers: managersPlans, mainPlan });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new dashboardsMiddleware();
