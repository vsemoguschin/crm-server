const ApiError = require('../../error/apiError');
const usersModelDto = require('./usersModelDto');
const usersRoles = require('./usersRoles');
const rolesPermissions = require('./usersPermissions');
const checkImgFormat = require('../../checking/checkFormat');
const uuid = require('uuid');
const checkUserEmailAndPassword = require('../../checking/checkUserEmailAndPassword');

class UsersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    const { role: requesterRole, fullName: requesterFullName, id: requesterId, ownersList: requesterOwnersList } = req.user;
    const { role } = req.body;

    try {
      const permission = rolesPermissions.createUser(requesterRole, role);
      if (!permission) {
        throw ApiError.Forbidden('Нет доступа');
      }
      const userDatas = new usersModelDto({ ...req.body }).check();
      if (!userDatas || !req?.files?.img) {
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const { img } = req.files;
      const imgFormat = checkImgFormat(img.name);
      if (!imgFormat) {
        throw ApiError.BadRequest('Не верный формат изображения');
      }

      userDatas.avatar = 'user_' + uuid.v4() + imgFormat;
      userDatas.password = userDatas.email;

      // fs.writeFileSync(__dirname, '..', '/static/', req.files.img.data, {encoding:'utf16le'})
      // avatar.mv(path.resolve(__dirname, '..', 'static/users_avatars', fileName))
      req.newUser = {
        ...userDatas,
        department: usersRoles[role].department,
        owner: {
          id: requesterId,
          fullName: requesterFullName,
          role: requesterRole,
        },
        ownersList: [requesterId, ...requesterOwnersList],
      };
      req.img = img;
      next();
    } catch (e) {
      next(e);
    }
  }

  getOne(req, res, next) {
    const { id } = req.params;
    try {
      //условие для админа
      if (+id == 1) {
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  getList(req, res, next) {
    const requesterRole = req.user.role;
    const { role } = req.query;
    try {
      const availableRoles = rolesPermissions.getListOfUsers(requesterRole);
      if (role && !availableRoles.some((availableRole) => availableRole == role)) {
        throw ApiError.Forbidden('Нет доступа');
      }
      if (!role) {
        req.query.role = availableRoles;
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  updateUser(req, res, next) {
    const { password, email, role, fullName, info, isDeleted, avatar } = req.body;
    const errorData = checkUserEmailAndPassword(email, password);
    if (errorData) {
      return res.status(400).message(errorData);
    }
    req.newUser = {
      email,
      password,
      role,
      fullName,
      avatar,
      info,
    };
    if (req.user.role === 'ADMIN') {
      req.newUser.isDeleted = isDeleted;
    }
    next();
  }
}

module.exports = new UsersRouterMiddleware();
