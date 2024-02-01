const ApiError = require('../../error/apiError');
const { User, modelFields: usersModelFields } = require('./usersModel');
const modelsService = require('../../services/modelsService');
const { ROLES: rolesList } = require('../roles/rolesList');
const checkImgFormat = require('../../checking/checkFormat');
const uuid = require('uuid');

const getAvailableRoles = (rolesArr) => {
  const list = [];
  for (let i = 0; i < rolesArr.length; i++) {
    list.push(rolesList.find(el => el.shortName == rolesArr[i]));
  }
  return list
};

const frontOptions = {
  usersRoles: {
    ['ADMIN']: rolesList,
    ['G']: rolesList,
    ['KD']: getAvailableRoles(['DO', 'ROP', 'MOP', 'ROV', 'MOV']),
    ['DP']: getAvailableRoles(['RP', 'FRZ', 'MASTER', 'PACKER']),
  },
  modelFields: modelsService.getModelFields(usersModelFields),
}; //возвращить на фронт опции
const permissions = {
  rolesList: {
    ['ADMIN']: rolesList.map(el => el.shortName),
    ['G']: rolesList.map(el => el.shortName),
    ['KD']: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
    ['DP']: ['RP', 'FRZ', 'MASTER', 'PACKER'],
  },
  updateFields: ['fullName', 'roleName', 'info'],
  searchFields: ['fullName', 'roleName']
};

class UsersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      const userRole = req.body.roleName;
      //проверка на доступ к созданию
      if (!permissions.rolesList[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      };
      //проверка на существование создаваемой роли
      if (!permissions.rolesList[requester].includes(userRole)) {
        console.log(false, 'no role');
        throw ApiError.BadRequest('Забыл что то указать');
      };
      //проверка на переданный аватар
      if (!req?.files?.img) {
        console.log(false, 'no avatar');
        throw ApiError.BadRequest('Забыл что то указать');
      };
      //проверка формата изображения
      const imgFormat = checkImgFormat(req.files.img.name);
      if (!imgFormat) {
        throw ApiError.BadRequest('Не верный формат изображения');
      }
      req.body.avatar = 'user_' + uuid.v4() + imgFormat;
      const newUser = await modelsService.checkFields(usersModelFields, req.body);
      newUser.department = rolesList.find(role => role.shortName == req.body.roleName).department
      // fs.writeFileSync(__dirname, '..', '/static/', req.files.img.data, {encoding:'utf16le'})
      // avatar.mv(path.resolve(__dirname, '..', 'static/users_avatars', fileName))
      req.newUser = newUser;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const requester = req.user.role;
      if (!permissions.rolesList[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      };
      req.rolesFilter = permissions.rolesList[requester];
      next()
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.rolesList[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      };
      req.rolesFilter = permissions.rolesList[requester];
      req.searchFields = permissions.searchFields;
      next();
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.rolesList[requester]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      };
      if (req.files?.img) {
        //проверка формата изображения
        const imgFormat = checkImgFormat(req.files.img.name);
        if (!imgFormat) {
          throw ApiError.BadRequest('Не верный формат изображения');
        }
        req.body.avatar = 'user_' + uuid.v4() + imgFormat;
      }
      req.rolesFilter = permissions.rolesList[requester];
      req.updateFields = permissions.updateFields;
      next()
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    const requester = req.user.role;
    if (!permissions.rolesList[requester]) {
      console.log(false, 'no acces');
      throw ApiError.Forbidden('Нет доступа');
    };
    req.rolesFilter = permissions.rolesList[requester];
    next()
  }
}

module.exports = new UsersRouterMiddleware();
