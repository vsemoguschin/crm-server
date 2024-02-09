const { Op } = require('sequelize');
const ApiError = require('../../error/apiError');
const { ROLES: rolesList } = require('../roles/rolesList');

const permissions = ['ADMIN', 'G', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'];
const fullAcces = ['ADMIN', 'G', 'DP', 'RP'];

class StagesRouterMiddleware {
  async getList(req, res, next) {
    try {
      console.log(req.body);
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const filter = {
        id: { [Op.gt]: 0 },
      };
      if (!fullAcces.includes(requester)) {
        filter.id = rolesList.find((user) => user.shortName === req.user.role).workStages;
      }
      req.filter = filter;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StagesRouterMiddleware();
