const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { File, modelFields: filesModelFields } = require('./filesModel');
const { Deal } = require('../deals/dealsModel');
const uuid = require('uuid');
const checkFileFormat = require('../../checking/checkFileFormat');

// const frontOptions = {
//   modelFields: modelsService.getModelFields(filesModelFields),
// };
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
// const updateFields = ['title', 'chatLink', 'clothingMethod', 'deadline', 'description', 'price', 'preview'];
// const searchFields = ['title', 'clothingMethod', 'status']

class FilesRouterMiddleware {
  async create(req, res, next) {
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      };
      //проверка значения и наличия сделки
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const deal = await Deal.findOne({
        where: { id: req.params.id }
      });
      if (!deal) {
        console.log(false, 'No deal');
        throw ApiError.BadRequest('No deal');
      }
      //проверка на preview
      if (!req?.files) {
        console.log(false, 'no files');
        throw ApiError.BadRequest('Забыл что то указать');
      };
      //проверка формата файла
      const fileType = checkFileFormat(req.files.file.name);
      if (!fileType) {
        throw ApiError.BadRequest('Не верный формат файла');
      }
      // req.body.avatar = 'user_' + uuid.v4() + imgFormat
      const downloadedFile = {
        name: req.files.file.name,
        size: req.files.file.size,
        url: 'public/' + fileType[0] + '/' + 1 + '.' + fileType[1],
        type: fileType[0],
      };
      // console.log(downloadedFile);
      // req.body.filesFormat = filesFormat;
      const newFile = await modelsService.checkFields(filesModelFields, downloadedFile);
      // return console.log(newFile);
      req.newFile = newFile;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        return console.log(false, 'no acces');
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
        return console.log(false, 'no acces');
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
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка на preview
      if (req?.files?.img) {
        //проверка формата изображения
        const previewFormat = checkImgFormat(req.files.img.name);
        if (!previewFormat) {
          throw ApiError.BadRequest('Не верный формат изображения');
        }
        req.body.previewFormat = previewFormat;
        req.body.preview = 'preview';
      };

      req.updateFields = updateFields;
      next()
    } catch (e) {
      next(e)
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}
console.log();


module.exports = new FilesRouterMiddleware();
