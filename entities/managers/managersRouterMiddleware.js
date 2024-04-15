const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');
// const { modelFields: usersModelFields, User } = require('./usersModel');
const modelsService = require('../../services/modelsService');
const { Role, User, Deal } = require('../association');
// const { Role } = require('../association');
// const { ROLES: rolesList } = require('../roles/rolesList');

class ManagersRouterMiddleware {
  async getOne(req, res, next) {
    try {
      let { id, userId } = req.params;
      const { year, month } = req.query;
      if (!year || !month) {
        throw ApiError.BadRequest('no period');
      }
      checkReqQueriesIsNumber({ year, month });
      if (+month > 12 || +month < 1) {
        throw ApiError.BadRequest('wrong month');
      }
      const period = new Date(year, month);
      const periodStart = new Date(year, month - 1);
      id = userId || id;
      const manager = await User.findOne({
        include: [
          'role',
          {
            model: Deal,
            include: 'payments',
          },
          'dops',
          'membership',
          'avatar',
          'group',
          'managersPlans',
        ],
        where: { id: id, '$role.shortName$': 'MOP' },
      });
      if (!manager) {
        return res.status(404).json('manager not found');
      }
      req.manager = manager;
      req.period = period.toISOString();
      req.periodStart = periodStart.toISOString();
      next();
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const searchFields = ['fullName'];
    const sortFields = ['userId', 'groupId', 'workspaceId', 'year', 'month', 'day'];
    try {
      const { workspaceId, userId, groupId } = checkReqQueriesIsNumber(req.query, sortFields);

      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      const searchParams = {
        include: [
          {
            model: Role,
            where: {
              shortName: 'MOP',
            },
          },
          {
            model: Deal,
            include: 'payments',
          },
          'managersPlans',
          'dops',
          'membership',
          'group',
        ],
        where: {
          ...searchFilter,
        },
        distinct: true,
      };

      if (workspaceId) {
        searchParams.include.push({
          association: 'membership',
          where: {
            id: workspaceId,
          },
        });
      }
      if (groupId) {
        searchParams.include.push({
          association: 'group',
          where: {
            id: groupId,
          },
        });
      }

      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ManagersRouterMiddleware();
