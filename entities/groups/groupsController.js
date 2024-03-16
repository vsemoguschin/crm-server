const { Group, modelFields: groupsModelFields } = require('./groupsModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');

class GroupsController {
  async create(req, res, next) {
    try {
      const { workSpace } = req;
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('забыл title');
      }
      const group = await Group.create({ title, workSpaceId: workSpace.id });
      return res.json(group);
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const { group } = req;
      return res.json(group);
    } catch (e) {
      next(e);
    }
  }

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

      const groups = await Group.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });

      const response = getPaginationData(groups, current, pageSize, 'groups');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { id } = req.params;

      const updates = await modelsService.checkUpdates([Group, groupsModelFields], req.body, ['title']);

      const group = await Group.findOne({
        where: {
          id,
        },
      });
      if (!group) {
        return res.status(404).json('group not found');
      }
      await group.update(updates);
      return res.status(200).json('succes');
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const group = await Group.findOne({
        where: {
          id,
        },
      });
      if (!group) {
        return res.status(404).json('group not found');
      }
      const deletedGroup = await group.destroy();
      if (deletedGroup === 0) {
        console.log('Группа не удалена');
        return res.json('Группа не удалена');
      }
      console.log('Группа удалена');
      return res.json('Группа удалена');
    } catch (e) {
      next(e);
    }
  }
  async addUsers(req, res, next) {
    try {
      const { user } = req;
      const { group } = req;
      await group.addGroup_members(user);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async removeUsers(req, res, next) {
    try {
      const { user } = req;
      const { group } = req;
      await group.removeGroup_members(user);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new GroupsController();
