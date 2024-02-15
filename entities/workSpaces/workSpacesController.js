const { WorkSpace, modelFields: workSpacesModelFields } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const { Order, Deal, Client } = require('../association');
const { Op } = require('sequelize');
const { ROLES: rolesList } = require('../roles/rolesList');
const ApiError = require('../../error/apiError');

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
        return res.json('Пространство существует');
      }
      await workSpace.addMember(req.user.id);
      await workSpace.setCreator(req.user.id);
      // console.log('created_workSpace', workSpace);
      return res.json(workSpace);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного пространства по id
  async getOne(req, res, next) {
    // get-запрос, получаем данные из param
    try {
      const { workspace } = req;
      let work;
      if (workspace.department === 'PRODUCTION') {
        let stageId = 1;
        if (req.query.stage && !isNaN(+req.query.stage)) {
          stageId = +req.query.stage;
        }
        work = await Deal.findAll({
          attributes: ['id', 'title', 'deadline'],
          include: [
            {
              model: Client,
              attributes: ['chatLink'],
            },
            {
              model: Order,
              where: {
                workSpaceId: workspace.id,
                stageId,
              },
            },
          ],
        });
      }
      if (workspace.department === 'COMERCIAL') {
        let status = 'created';
        console.log(req.query.status);
        if (req.query.status) {
          status = req.query.status;
        }
        work = await Deal.findAndCountAll({
          where: {
            status: status,
          },
          // attributes: ['id', 'title', 'deadline'],
          include: [
            {
              model: Client,
            },
            {
              model: Order,
            },
          ],
        });
      }
      return res.json(work);
    } catch (e) {
      next(e);
    }
  }

  //получения всех пространств по заданным параметрам
  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      const requester = req.user.role;
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      //добавить разрешение на просмотр где создатель или участник
      let department = ['PRODUCTION', 'COMERCIAL'];
      if (rolesList.find((user) => user.shortName === requester)) {
        department = [rolesList.find((user) => user.shortName === requester).department];
      }
      const workSpaces = await WorkSpace.findAndCountAll({
        where: {
          ...filter,
          department: department,
        },
        attributes: ['id', 'title', 'fullName', 'department'],
        // order,
        // limit,
        // offset,
      });
      const response = getPaginationData(workSpaces, pageNumber, pageSize, 'workSpaces');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  //обновляем данные клиента
  async update(req, res, next) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(workSpacesModelFields, req.body, req.updateFields);

      const [, workSpace] = await WorkSpace.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(workSpace);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async delete(req, res, next) {
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
      next(e);
    }
  }
  async addOrders(req, res, next) {
    try {
      const { ordersIds } = req.body;
      const { workspace } = req.body;
      const orders = await Order.findAll({
        where: { id: ordersIds },
      });
      await workspace.addOrders(orders);
      return res.json(workspace);
    } catch (e) {
      next(e);
    }
  }
  async ordersList(req, res, next) {
    const { pageSize, pageNumber, status } = req.query;
    const { stageId, workSpaceId } = req;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const orders = await Deal.findAndCountAll({
        attributes: ['id', 'title'],
        include: [
          {
            model: Client,
            attributes: ['chatLink'],
          },
          {
            model: Order,
            where: {
              workSpaceId: workSpaceId,
              stageId: stageId,
              status: status || ['Доступный', 'В работе'],
            },
            include: 'files',
          },
          'files',
        ],
        limit,
        offset,
        // order: { ['DESC']: ['deadline'] },//?
      });
      const response = getPaginationData(orders, pageNumber, pageSize, 'orders');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpaceController();
