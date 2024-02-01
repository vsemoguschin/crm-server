const { WorkSpace, modelFields: workSpacesModelFields } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const getPagination = require("../../utils/getPagination");
const getPaginationData = require("../../utils/getPaginationData");

class WorkSpaceController {
  async create(req, res, next) {
    try {
      const { newWorkSpace } = req;
      const [workSpace, created] = await WorkSpace.findOrCreate({
        where: { title: newWorkSpace.title },
        defaults: {
          ...newWorkSpace,
        },
      });
      if (!created) {
        console.log(false, 'Пространство существует');
        return res.json('Пространство существует')
      };
      await workSpace.addMember(req.user.id);
      await workSpace.setCreator(req.user.id);
      // console.log('created_workSpace', workSpace);
      return res.json(workSpace);
    } catch (e) {
      next(e)
    }
  }

  //получение конкретного клиента по id
  async getOne(req, res, next) {
    // get-запрос, получаем данные из param
    try {
      const { id } = req.params;
      const workSpace = await WorkSpace.findOne({
        where: {
          id,
        },
        include: ['creator', 'members', ]
      });
      return res.json(workSpace);
    } catch (e) {
      next(e);
    }
  }

  //получения всех клиентов по заданным параметрам
  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key,//?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      const workSpaces = await WorkSpace.findAndCountAll({
        where: filter,
        attributes: ['title', 'creatorId', 'fullName', 'department'],
        order,
        limit,
        offset,
        // include: 'deals',
      });
      const response = getPaginationData(
        workSpaces,
        pageNumber,
        pageSize,
        "workSpaces"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  //обновляем данные клиента
  async update(req, res) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(workSpacesModelFields, req.body, req.updateFields);
  
      const [updated, workSpace] = await WorkSpace.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(workSpace)
      return res.json(!!updated, updates);
    } catch (e) {
      console.log(e);
    }
  }

  //удалить клиента
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedWorkSpace = await WorkSpace.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedWorkSpace);
      if (deletedWorkSpace === 0) {
        console.log('Клиент не удален');
        return res.json('Клиент не удален');
      }
      console.log('Клиент удален');
      return res.json('Клиент удален');
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new WorkSpaceController();
