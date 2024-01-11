const ApiError = require("../../error/apiError");
const bcrypt = require("bcrypt");
const { User, WorkSpace } = require("../association");
const { Op } = require("sequelize");
const fs = require("fs-extra");
// const diskService = require("../services/diskService");
const getPagination = require("../../utils/getPagination");
const getPaginationData = require("../../utils/getPaginationData");
class UsersController {
  //создание пользователя
  async create(req, res, next) {
    const { newUser, img } = req;
    const { email, avatar } = newUser;
    try {
      // хешируем пароль
      newUser.password = await bcrypt.hash(newUser.password, 3);

      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: newUser,
      });
      if (!created) {
        throw ApiError.BadRequest("Пользователь с таким email уже существует");
      }
      const filePath = 'avatars/' + avatar;
      fs.writeFileSync('public/' + filePath, img.data, err => {
        if (err) {
          throw ApiError.BadRequest('Wrong');
        };
      });
      //тут функция отправки файла на яндекс диск
      // await diskService.saveAvatar(filePath);
      //
      // fs.unlinkSync('public/' + filePath);
      //что нужно вернуть?
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  //получение конкретного пользователя по id
  async getOne(req, res, next) {
    const { id } = req.params;
    //себя выводить ссылкой на личный кабинет
    //если менеджер - выводить
    // - сделки(сортировка по сделкам?(закрытые в процессе)), сумма сделок, допы, суммы допов
    // - информация - роль, руководителя

    //если РОП 
    // - сделки свои, сделки подчиненых, сумма сделок своих и подчиненых, то же самое с допами

    //если 
    const requesterId = req.user.id;
    const managersAssociations = [
      {
        association: 'deals',
        include: [{
          association: ['orders', 'clients'],
        }]
      }
    ];
    console.log(id);
    try {
      let user;
      //свои данные
      if (+id === requesterId) {
        user = await User.findOne({
          where: { id },
          attributes: { exclude: ["password"] },
        });
      } else {
        user = await User.findOne({
          where: {
            id,
            ownersList: {
              [Op.contains]: [requesterId],
            },
          },
          attributes: { exclude: ["password"] },
          include: [
            {
              association: 'deals',
              attributes:
                ['id', 'title'],
            },
            {
              association: 'workSpace',
              attributes:
                ['id', 'name'],
              include: [{
                association: 'orders',
              }]
            }
          ]
        });
      }
      if (!user) {
        throw ApiError.BadRequest("Пользователь не существует");
      }
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  //получения всех пользователей по заданным параметрам
  async getList(req, res, next) {
    // get-запрос передаем query параметры
    const {
      owner,
      role,
      pageSize,
      pageNumber,
      key,//?
      order: queryOrder,
      fieldSearch,
      fieldSearchValue,
    } = req.query;
    const requesterId = req.user.id;
    const { limit, offset } = getPagination(pageNumber, pageSize);
    const currentOwner = owner || requesterId;

    try {
      const owners = [requesterId, currentOwner];
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const whereFilters = fieldSearch
        ? {
          [Op.and]: [
            {
              [fieldSearch]: {
                [Op.iRegexp]: fieldSearchValue,
              },
            },
          ],
        }
        : {};

      const squelizeBody = {
        where: {
          role: role,
          ...whereFilters,
          ownersList: {
            [Op.contains]: owners,
          },
        },
        order,
        limit,
        offset,
      };

      const users = await User.findAndCountAll(squelizeBody);

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
      const { params, body } = req;
      const { id } = params;
      const updates = body;
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 3);
      }
      const user = await User.update(updates, {
        where: {
          ownersList: { [Op.contains]: [req.user.id] },
          id: id,
        },
      });
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).message({
          message:
            "Ошибка сохранения пользователя. Обратитесь к администратору",
        });
      }
    } catch (error) {
      return res.status(404).message({
        message: "Ошибка сохранения пользователя. Обратитесь к администратору",
      });
    }
  }

  //обновляем данные пользователя
  async delete(req, res) {
    // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
    const { id } = req.params;
    const user = await User.update(
      { isDeleted: true },
      {
        where: {
          ownersList: { [Op.contains]: [req.user.id] },
          id: id,
        },
      }
    );
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).message({
        message: "Ошибка удаления пользователя. Обратитесь к администратору",
      });
    }
  }
}

module.exports = new UsersController();
