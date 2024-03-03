const checkFormat = require('../../checking/checkFormat');
const ApiError = require('../../error/apiError');
const { File } = require('./filesModel');

const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class FilesRouterMiddleware {
  async dealsFiles(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка на file
      if (!req?.files?.file) {
        console.log(false, 'no files');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async ordersImgs(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      if (!['ADMIN', 'G', 'DP', 'RP', 'MASTER', 'PACKER'].includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет достsddsdупа');
      }
      //проверка на file
      if (!req?.files?.file) {
        console.log(false, 'no files');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      if (!checkFormat(req.files.file.name)) {
        console.log(false, 'only imgs');
        throw ApiError.BadRequest('Только изображения');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requesterRole)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const file = await File.findOne({
        where: { id: req.params.id },
      });
      if (!file) {
        console.log(false, 'No file');
        throw ApiError.BadRequest('No file');
      }
      const { type, ya_name } = file;
      const filePath = type + '/' + ya_name;
      req.filePath = filePath;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FilesRouterMiddleware();
