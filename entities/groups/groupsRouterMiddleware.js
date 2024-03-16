const { Group } = require('./groupsModel');
const modelsService = require('../../services/modelsService');

class GroupsRouterMiddleware {
  async getOne(req, res, next) {
    try {
      let { id, groupId } = req.params;
      id = groupId || id;
      const group = await Group.findOne({
        where: {
          id,
        },
        include: ['group_members'],
      });
      if (!group) {
        return res.status(404).json('group not found');
      }
      req.group = group;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const searchFields = ['title'];
    try {
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      const searchParams = {
        // include: ['group_members'],
        where: {
          ...searchFilter,
        },
        distinct: true,
      };
      if (req.baseUrl.includes('/workspaces')) {
        const { workSpace } = req;
        searchParams.where.workSpaceId = workSpace.id;
      }

      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new GroupsRouterMiddleware();
