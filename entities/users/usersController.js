const ApiError = require("../../error/apiError");
const bcrypt = require("bcrypt");
const { User, modelFields: usersModelFields } = require("./usersModel");
const { Role } = require("../association");
const modelsService = require('../../services/modelsService');
const fs = require("fs-extra");
// const diskService = require("../services/diskService");
const getPagination = require("../../utils/getPagination");
const getPaginationData = require("../../utils/getPaginationData");

class UsersController {
  //создание пользователя
  async create(req, res, next) {
    const { newUser } = req;
    const { email, avatar } = newUser;
    try {
      const role = await Role.findOne({ where: { shortName: newUser.roleName } });
      const roleId = role.dataValues.id;
      // хешируем пароль
      newUser.password = await bcrypt.hash(newUser.password, 3);
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          ...newUser,
          roleId: roleId,
        },
      });
      // console.log(user);
      if (!created) {
        console.log(false, 'Пользователь с таким email уже существует');
        throw ApiError.BadRequest('Пользователь с таким email уже существует');
      };
      // console.log('created_user', user);
      const filePath = 'avatars/' + avatar;
      fs.writeFileSync('public/' + filePath, req.files.img.data, err => {
        if (err) {
          throw ApiError.BadRequest('Wrong');
        };
      });
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного пользователя по id
  async getOne(req, res, next) {
    //если менеджер - выводить
    // - сделки(сортировка по сделкам?(закрытые в процессе)), сумма сделок, допы, суммы допов
    // - информация - роль, руководителя

    //если РОП 
    // - сделки свои, сделки подчиненых, сумма сделок своих и подчиненых, то же самое с допами

    try {
      const { id } = req.params;
      const { rolesFilter } = req;
      const user = await User.findOne({
        where: {
          id,
          roleName: rolesFilter
        },
        include: ['role', 'deals']
      });
      // console.log(rolesFilter);
      return res.json(user?.dataValues || null);
    } catch (e) {
      next(e);
    }
  }

  //получения всех пользователей по заданным параметрам
  async getList(req, res, next) {
    // get-запрос передаем query параметры
    const {
      pageSize,
      pageNumber,
      key,//?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const { rolesFilter, searchFeilds } = req;
      const filter = await modelsService.searchFilter(searchFeilds, req.query);
      const users = await User.findAndCountAll({
        where: {
          roleName: rolesFilter,
          ...filter
        },
        order,
        limit,
        offset,
      });

      const response = getPaginationData(users, pageNumber, pageSize, "users");
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  //обновляем данные пользователя
  async update(req, res) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { rolesFilter } = req;
        const { id } = req.params;
        if (req.body.roleName && !rolesFilter.includes(req.body.roleName)) {
          throw ApiError.Forbidden('Нет доступа');
        };
        const updates = await modelsService.checkUpdates(usersModelFields, req.body, req.updateFields);
        //смена роли
        if (updates.roleName) {
            const role = await Role.findOne({
                where: {
                    shortName: updates.roleName
                }
            });
            updates.roleId = role.dataValues.id;
        }
        const [updated, user] = await User.update(updates, {
            where: {
                id: id,
                roleName: rolesFilter,
            },
            individualHooks: true,
            include: 'role'
        });
        return res.json(!!updated, updates);
    } catch (error) {
      return res.status(404).message({
        message: "Ошибка сохранения пользователя. Обратитесь к администратору",
      });
    }
  }

  //удаление пользователя
  async delete(req, res) {
    try {
      const { rolesFilter } = req;
        const { id } = req.params;
        console.log(rolesFilter);
        const deletedUser = await User.destroy({
            where: {
                id,
                roleName: rolesFilter
            },
        });
        // console.log(deletedUser);
        if (deletedUser === 0) {
            console.log('Пользователь не удален');
            return res.json('Пользователь не удален');
        }
        console.log('Пользователь удален');
        return res.json('Пользователь удален');
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UsersController();
