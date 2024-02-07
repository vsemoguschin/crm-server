const { Client, modelFields: clientsModelFields } = require('./clientsModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const { Op } = require('sequelize');

class ClientController {
  async create(req, res, next) {
    try {
      const { newClient } = req;
      const [client, created] = await Client.findOrCreate({
        where: { phone: newClient.phone },
        defaults: {
          ...newClient,
          userId: req.user.id,
        },
      });
      if (!created) {
        console.log(false, 'Клиент существует');
        return res.json('Клиент существует');
      }
      console.log('created_client', client);
      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного клиента по id
  async getOne(req, res, next) {
    // get-запрос, получаем данные из param
    try {
      const { id } = req.params;
      const client = await Client.findOne({
        where: {
          id,
        },
        include: ['deals'],
      });
      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

  //получения всех клиентов по заданным параметрам
  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
    } = req.query;
    const { filter } = req.body;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const clients = await Client.findAndCountAll({
        where: {
          id: { [Op.gt]: 2 },
          ...filter,
        },
        attributes: ['id', 'fullName', 'phone', 'gender', 'type', 'info', 'city', 'chatLink'],
        order,
        limit,
        offset,
        // include: 'deals',
      });
      const response = getPaginationData(clients, pageNumber, pageSize, 'clients');
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
      const updates = await modelsService.checkUpdates(clientsModelFields, req.body, req.updateFields);

      const [, client] = await Client.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(client);
    } catch (e) {
      // console.log(e);
      next(e);
    }
  }

  //удалить клиента
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedClient = await Client.destroy({
        where: {
          id,
        },
      });
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
