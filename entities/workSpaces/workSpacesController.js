const { WorkSpace, modelFields: workSpacesModelFields } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const { Order, Deal, User, Role } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');
const ApiError = require('../../error/apiError');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

class WorkSpaceController {
  async create(req, res, next) {
    try {
      const { newWorkSpace } = req;
      const workSpace = await WorkSpace.create(newWorkSpace);
      await workSpace.addMember(req.user.id);
      await workSpace.setCreator(req.user.id);
      return res.json(workSpace);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного пространства по id
  async getOne(req, res, next) {
    // get-запрос, получаем данные из param
    try {
      const { workSpace } = req;
      const { id, title, department, creator } = workSpace;
      return res.json({ id, title, department, creator });
    } catch (e) {
      next(e);
    }
  }
  //получения всех пространств по заданным параметрам
  async getList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      checkReqQueriesIsNumber({ pageSize, current });
      const requester = req.user.role;
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      let workSpaces;
      if (rolesList[requester].department == 'administration') {
        workSpaces = await WorkSpace.findAndCountAll({
          ...filter,
        });
      } else {
        workSpaces = await WorkSpace.findAndCountAll({
          ...filter,
          include: [
            {
              association: 'members',
              where: {
                id: req.user.id,
              },
            },
          ],
          distinct: true,
          limit,
          offset,
          order,
        });
      }
      const response = getPaginationData(workSpaces, current, pageSize, 'workSpaces');
      // response.createdFields = modelsService.getModelFields(workSpacesModelFields);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { workSpace, user } = req;
      const requester = req.user.role;
      if (workSpace.creator.id !== user.id && requester !== 'ADMIN' && requester !== 'G') {
        console.log(false, 'no access');
        throw ApiError.Forbidden('Нет доступа');
      }
      const updates = await modelsService.checkUpdates(workSpacesModelFields, req.body, ['title']);
      await workSpace.update(updates);
      return res.status(200).json(workSpace);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const { workSpace, user } = req;
      const requester = req.user.role;
      if (workSpace.creator.id !== user.id && requester !== 'ADMIN' && requester !== 'G') {
        console.log(false, 'no access');
        throw ApiError.Forbidden('Нет доступа');
      }
      const deletedWorkSpace = await workSpace.destroy();
      if (deletedWorkSpace === 0) {
        console.log('Пространство не удалено');
        return res.json('Пространство не удалено');
      }
      console.log('Пространство удалено');
      return res.json('Пространство удалено');
    } catch (e) {
      next(e);
    }
  }
  //добавить пользователя в пространство
  async addUsers(req, res, next) {
    try {
      const { workSpace } = req;
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }

      const user = await User.findOne({
        where: { id: req.params.userId },
        include: [
          {
            model: Role,
            where: {
              shortName: rolesList[requester].availableRoles,
            },
          },
        ],
      });
      if (!user) {
        console.log(false, 'No user');
        throw ApiError.BadRequest('No user');
      }
      await workSpace.addMembers(user);
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
  //удалить пользователя из пространства
  async deleteUsers(req, res, next) {
    try {
      const { workSpace } = req;
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }

      const user = await User.findOne({
        where: { id: req.params.userId },
        include: [
          {
            model: Role,
            where: {
              shortName: rolesList[requester].availableRoles,
            },
          },
          {
            association: 'membership',
            where: {
              id: workSpace.id,
            },
          },
        ],
      });
      if (!user) {
        console.log(false, 'No user');
        throw ApiError.BadRequest('No user');
      }
      await workSpace.removeMembers(user);
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpaceController();
