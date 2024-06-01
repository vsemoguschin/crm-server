const ApiError = require('../../error/apiError');
const { modelFields: clientsModelFields, Client } = require('./clientsModel');
const modelsService = require('../../services/modelsService');
const checkPermissions = require('./clientsPermissions');
const { Op } = require('sequelize');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

const frontOptions = {
  modelFields: modelsService.getModelFields(clientsModelFields),
};

class ClientsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requesterRole = req.requester.role;
      console.log(requesterRole);
      checkPermissions(requesterRole);
      // const { workSpace } = req;
      // if (workSpace.department !== 'COMMERCIAL') {
      //   console.log(false, 'No access');
      //   throw ApiError.BadRequest('No access');
      // }
      req.newClient = await modelsService.checkFields([Client, clientsModelFields], req.body);

      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      checkPermissions(requesterRole);
      if (requesterRole !== 'ADMIN' && req.params.id < 3) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const { id } = req.params;
      const client = await Client.findOne({
        where: {
          id,
        },
        include: ['user', 'deals'],
      });
      if (!client) {
        throw ApiError.NotFound('Client not found');
      }
      req.client = client;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      checkPermissions(requesterRole);
      const searchFields = ['gender', 'type', 'fullName', 'chatLink', 'phone'];
      const searchFilter = await modelsService.searchFilter(searchFields, req.query);
      let searchParams = {
        where: {
          id: { [Op.gt]: 2 },
          ...searchFilter,
        },
      };
      if (req.baseUrl.includes('/workspaces')) {
        const { workSpace } = req;
        searchParams = {
          where: {
            id: { [Op.gt]: 2 },
            workSpaceId: workSpace.id,
            ...searchFilter,
          },
        };
      }
      if (req.baseUrl.includes('/users')) {
        const { workSpaceId } = req.query;
        checkReqQueriesIsNumber({ workSpaceId });
        searchParams = {
          where: {
            id: { [Op.gt]: 2 },
            userId: req.params.id,
            workSpaceId: workSpaceId || { [Op.gt]: 0 },
            ...searchFilter,
          },
        };
      }
      req.searchParams = searchParams;
      next();
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new ClientsRouterMiddleware();
