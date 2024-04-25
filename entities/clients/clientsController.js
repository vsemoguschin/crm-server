const { Client, modelFields: clientsModelFields, Spheres } = require('./clientsModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');

class ClientController {
  async create(req, res, next) {
    try {
      const { newClient, workSpace } = req;
      newClient.userId = req.requester.id;
      const client = await workSpace.createClient(newClient);

      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного клиента по id
  async getOne(req, res, next) {
    // get-запрос, получаем данные из param
    try {
      const { client } = req;
      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

  //получения всех клиентов по заданным параметрам
  async getList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;

    try {
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : [['createdAt', 'DESC']];

      const { searchParams } = req;
      // console.log(pageSize, current);
      // console.log(limit, offset);
      const clients = await Client.findAndCountAll({
        ...searchParams,
        distinct: true,
        // attributes: ['id', 'fullName', 'phone', 'gender', 'type', 'info', 'city', 'chatLink'],
        limit,
        offset,
        order,
      });
      const response = getPaginationData(clients, current, pageSize, 'clients');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  //обновляем данные клиента
  async update(req, res, next) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    const updateFields = ['gender', 'city', 'region', 'type', 'sphere', 'fullName', 'chatLink', 'phone', 'info', 'inn', 'adLink', 'firstContact'];
    try {
      const { client } = req;
      const body = checkRepeatedValues(client, req.body);
      const updates = await modelsService.checkUpdates([Client, clientsModelFields], body, updateFields);
      await client.update(updates);
      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

  //удалить клиента
  async delete(req, res, next) {
    try {
      const { client } = req;
      const deletedClient = await client.destroy();
      // console.log(deletedClient);
      if (deletedClient === 0) {
        console.log('Клиент не удален');
        return res.json('Клиент не удален');
      }
      console.log('Клиент удален');
      return res.json('Клиент удален');
    } catch (e) {
      next(e);
    }
  }
  async getSpheres(req, res, next) {
    try {
      const spheres = await Spheres.findAll();
      return res.json(spheres);
    } catch (e) {
      next(e);
    }
  }
  async createSpheres(req, res, next) {
    try {
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [sphere, created] = await Spheres.findOrCreate({ where: { title } });
      return res.json(sphere);
    } catch (e) {
      next(e);
    }
  }
  async deleteSpheres(req, res, next) {
    try {
      const { sphereId } = req.params;
      const sphere = await Spheres.findOne({ where: { id: sphereId } });
      if (sphere) {
        sphere.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ClientController();
