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
      id = userId || id;
      const manager = await User.findOne({
        include: ['role'],
        where: { id: id, '$role.shortName$': 'MOP' },
      });
      if (!manager) {
        return res.status(404).json('manager not found');
      }
      console.log(req.query);
      req.manager = manager;
      req.period = req.query.period;
      // return res.json(manager)
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
          // 'membership',
          'group',
        ],
        where: {
          ...searchFilter,
        },
        distinct: true,
      };

      if (req.baseUrl.includes('/workspaces')) {
        const { workSpace } = req;
        searchParams.where.workSpaceId = workSpace.id;
      }

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
