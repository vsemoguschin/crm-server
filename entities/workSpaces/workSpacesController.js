const { WorkSpace, modelFields: workSpacesModelFields } = require('./workSpacesModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const { Order, Deal, Client, User } = require('../association');
const { Op } = require('sequelize');
const { ROLES: rolesList } = require('../roles/rolesList');
const ApiError = require('../../error/apiError');
const { availableStages, stageList, Stage } = require('../stages/stagesModel');

const getWork = {
  ['PRODUCTION']: async (req) => {
    const statuses = ['Доступный', 'В работе'];
    const requester = req.user.role;
    let { status, stage } = req.query;
    stage = stageList[+stage - 1] || availableStages[requester][0];
    status = statuses.includes[status] ? status : statuses[0];
    console.log(status);
    const cards = await Deal.findAndCountAll({
      attributes: ['title', 'deadline'],
      where: {
        // status: 'process',
      },
      include: [
        'files',
        {
          model: Order,
          attributes: ['id', 'isMarketPlace', 'name', 'material', 'boardWidth', 'boardHeight', 'stand', 'holeType', 'fittings', 'status'],
          where: {
            status: status,
          },
          include: [
            'neons',
            {
              model: Stage,
              where: { id: stage.id },
              attributes: [],
            },
          ],
        },
      ],
    });
    const datas = {
      cards: get,
      stages: availableStages[requester],
      statuses: statuses,
    };
    const { workSpace } = req;
    return datas;
  },
};

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
      const { department } = workSpace;
      const datas = await getWork[department](req);
      console.log(datas, false);

      return res.json(datas);
    } catch (e) {
      next(e);
    }
  }
  //old
  async getOld(req, res, next) {
    // get-запрос, получаем данные из param
    try {
      const { workSpace } = req;
      let work;
      if (workSpace.department === 'PRODUCTION') {
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
                workSpaceId: workSpace.id,
                stageId,
              },
            },
          ],
        });
      }
      if (workSpace.department === 'COMMERCIAL') {
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
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
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
        const user = await User.findOne({
          where: {
            id: req.user.id,
          },
        });
        console.log(user);
        workSpaces = await user.getMembership();
        return res.json(workSpaces);
      }
      // const response = getPaginationData(workSpaces, current, pageSize, 'workSpaces');
      // response.createdFields = modelsService.getModelFields(workSpacesModelFields);
      return res.json(workSpaces || []);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(workSpacesModelFields, req.body, req.updateFields);

      const workSpace = await WorkSpace.update(updates, {
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
        console.log('Пространство не удалено');
        return res.json('Пространство не удалено');
      }
      console.log('Пространство удалено');
      return res.json('Пространство удалено');
    } catch (e) {
      next(e);
    }
  }
  async addOrders(req, res, next) {
    try {
      const { ordersIds } = req.body;
      const { workSpace } = req.body;
      const orders = await Order.findAll({
        where: { id: ordersIds },
      });
      await workSpace.addOrders(orders);
      return res.json(workSpace);
    } catch (e) {
      next(e);
    }
  }
  async ordersList(req, res, next) {
    const { pageSize, current, status } = req.query;
    const { stageId, workSpaceId } = req;
    try {
      const { limit, offset } = getPagination(current, pageSize);
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
          },
          'files',
        ],
        limit,
        offset,
        // order: { ['DESC']: ['deadline'] },//?
      });
      // const response = getPaginationData(orders, current, pageSize, 'orders');
      return res.json(orders || []);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new WorkSpaceController();
