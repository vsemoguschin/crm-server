const { Client, modelFields: clientsModelFields } = require('./clientsModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');

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
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchParams } = req;

      const clients = await Client.findAndCountAll({
        ...searchParams,
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
    const updateFields = ['gender', 'city', 'region', 'type', 'sphere', 'fullName', 'chatLink', 'phone', 'info'];
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
}

module.exports = new ClientController();
