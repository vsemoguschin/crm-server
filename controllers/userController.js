const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const { User } = require('../models/models');
const permissionService = require('../service/permissonService');
// console.log(permissionService.userGuard("KD"));
// console.log(!!permissionService.userGuard("ADMIN"));

function clearEmptyFields(obj) {
    const newObject = { ...obj }
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) {
        delete newObject[key]
      }
    }
    return newObject
}


class UserController {
    async create(req, res, next) { //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
        const { id } = req.user;
        try {
            const { email, fullName, password, role, owner, status } = req.body;
            if (!email || !password || !fullName || !role || !owner) {
                throw ApiError.BadRequest('Забыл что то указать');
            };
            const requester = req.user.role;
            const roleRequest = role;
            const permission = permissionService.userGuard(requester, roleRequest);

            if (!permission) {
                throw ApiError.Forbidden('Нет доступа');
            }

            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                throw ApiError.BadRequest('Пользователь с таким email уже существует');
            }
            const hashPassword = await bcrypt.hash(password, 3); //хешируем пароль
            const user = await User.create({ email, fullName, password: hashPassword, role, owner: id, status });
            return res.json(user);
        } catch (e) {
            next(e)
        }
    };

    //получение конкретного пользователя по id
    async getOne(req, res, next) { // get-запрос, получаем данные из params
        const { id } = req.params;
        const requester = req.user.role;
        if (id && id >= 0) {
            const user = await User.findOne({ where: { id } });
            const permission = permissionService.userGuard(requester, user.role);
            if (!permission) {
                throw ApiError.Forbidden('Нет доступа');
            }
            return res.json(user)
        };
        next()
    };



    //получения всех пользователей по заданным параметрам
    async getAll(req, res) { // get-запрос передаем query параметры
        const { role, groupId, id } = req.query;

        if (!role || !id || !ownler) return res.status(404).json('Не передана Роль')

        let filter = clearEmptyFields({role, groupId, owner: id});

        const permission = permissionService.userGuard(req.user.role);
        if (!permission) {
            throw ApiError.Forbidden('Нет доступа');
        }
        if (permission.options) {
            filter.role = permission.options;
        }

        const users = await User.findAll({ where: filter });
        return res.json(users)
    };

    //обновляем данные пользователя
    async update(req, res) { // patch-запрос  в теле запроса(body) передаем строку(raw) в формате JSON
        const { id } = req.params;
        const updates = req.body;
        const user = await User.update(updates, { where: { id: id } });
        return res.json(user);
    };

};

module.exports = new UserController();