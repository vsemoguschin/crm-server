const { WorkSpace, modelFields: workSpacesModelFields } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const { User, Role } = require('../association');
const { ROLES: rolesList } = require('../roles/rolesList');
const ApiError = require('../../error/apiError');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

class WorkSpaceController {
  async create(req, res, next) {
    try {
      const { newWorkSpace } = req;
      const workSpace = await WorkSpace.create(newWorkSpace);
      await workSpace.addMember(req.requester.id);
      await workSpace.setCreator(req.requester.id);
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
      const requesterRole = req.requester.role;
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      let workSpaces;
      console.log(requesterRole);
      if (rolesList[requesterRole].department == 'administration') {
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
                id: req.requester.id,
              },
              attributes: [],
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
      const requesterRole = req.requester.role;
      if (workSpace.creator.id !== user.id && requesterRole !== 'ADMIN' && requesterRole !== 'G') {
        console.log(false, 'no access');
        throw ApiError.Forbidden('Нет доступа');
      }
      const updates = await modelsService.checkUpdates([WorkSpace, workSpacesModelFields], req.body, ['title']);
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
      const requesterRole = req.requester.role;
      if (workSpace.creator.id !== user.id && requesterRole !== 'ADMIN' && requesterRole !== 'G') {
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
      const { workSpace, user } = req;
      const requesterRole = req.requester.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      if (workSpace.department !== user.role.department) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
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
      const { workSpace, user } = req;
      const requesterRole = req.requester.role;
      if (!['ADMIN', 'G', 'KD', 'DP', 'DO', 'RP'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      await workSpace.removeMembers(user);
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpaceController();
