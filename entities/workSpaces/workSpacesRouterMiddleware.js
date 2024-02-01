const ApiError = require("../../error/apiError");
const { WorkSpace, modelFields: workSpacesModelFields } = require("./workSpacesModel");
const modelsService = require('../../services/modelsService');

const frontOptions = {
  modelFields: modelsService.getModelFields(workSpacesModelFields),
};
const permissions = ['ADMIN', 'G', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'];
const updateFields = ['title'];
const searchFields = ['title', 'department'];


class WorkSpacesRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.newWorkSpace = await modelsService.checkFields(workSpacesModelFields, req.body);
      console.log(req.WorkSpace);
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.searchFields = searchFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      req.updateFields = updateFields;
      next()
    } catch (e) {
      next(e)
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      if (!['ADMIN', 'G', 'DO', 'DP'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new WorkSpacesRouterMiddleware();
