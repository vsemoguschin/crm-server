const bcrypt = require('bcrypt');
const { User, modelFields: usersModelFields } = require('./usersModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const getPaginationData = require('../../utils/getPaginationData');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const { ManagersPlan } = require('../association');

class UsersController {
  //создание менеджера
  async createManager(req, res, next) {
    const { newUser, userRole, group } = req;
    try {
      // хешируем пароль
      newUser.password = await bcrypt.hash(newUser.password, 3);
      const user = await userRole.createUser({ ...newUser, groupId: group.id, workSpaceId: group.workSpaceId });

      if (['MOP'].includes(userRole.shortName)) {
        console.log(user);
        const period = user.createdAt.toISOString().slice(0, 7);
        await ManagersPlan.create({ userId: user.id, plan: 0, period });
      }

      delete user.dataValues.password;
      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }
  //создание пользователя
  async create(req, res, next) {
    const { newUser, userRole } = req;
    try {
      // хешируем пароль
      newUser.password = await bcrypt.hash(newUser.password, 3);
      const user = await userRole.createUser(newUser);

      if (['MOP'].includes(userRole.shortName)) {
        console.log(user);
        const period = user.createdAt.toISOString().slice(0, 7);
        await ManagersPlan.create({ userId: user.id, plan: 0, period });
      }

      delete user.dataValues.password;
      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного пользователя по id
  async getOne(req, res, next) {
    try {
      const { user } = req;
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  //получения всех пользователей по заданным параметрам
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
      const order = queryOrder ? [[key, queryOrder]] : [['createdAt', 'DESC']];

      const users = await User.findAndCountAll({
        ...searchParams,
        order,
        limit,
        offset,
      });

      const response = getPaginationData(users, current, pageSize, 'users');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  //обновляем данные пользователя
  async update(req, res, next) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { id } = req.params;

      const updates = await modelsService.checkUpdates([User, usersModelFields], req.body, req.updateFields);
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 3);
      }
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return res.status(404).json('user not found');
      }
      await user.update(updates);
      return res.status(200).json('succes');
    } catch (e) {
      next(e);
    }
  }

  //удаление пользователя
  async delete(req, res, next) {
    try {
      const { user } = req;
      // return console.log('delete', user);
      const deletedUser = await user.destroy();
      if (deletedUser === 0) {
        console.log('Пользователь не удален');
        return res.json('Пользователь не удален');
      }
      console.log('Пользователь удален');
      return res.json('Пользователь удален');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UsersController();