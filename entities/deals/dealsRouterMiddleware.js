const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: dealsModelFields } = require('./dealsModel');
const { Client } = require('../clients/clientsModel');
const checkImgFormat = require('../../checking/checkFormat');

const frontOptions = {
  modelFields: modelsService.getModelFields(dealsModelFields),
};
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];
const updateFields = ['title', 'chatLink', 'clothingMethod', 'deadline', 'description', 'price'];
const searchFields = ['title', 'clothingMethod', 'status'];

class DealsRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка значения и наличия клиента
      if ((!req.params.id || isNaN(+req.params.id)) && (!req.body.clientId || isNaN(+req.body.clientId))) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const client = await Client.findOne({
        where: { id: req.params.id || req.body.clientId },
      });
      if (!client) {
        console.log(false, 'No client');
        throw ApiError.BadRequest('No client');
      }

      //проверка формата изображения
      const newDeal = await modelsService.checkFields(dealsModelFields, req.body);

      req.newDeal = newDeal;
      next();
    } catch (e) {
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
      }

      req.updateFields = updateFields;
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
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
}
console.log();

module.exports = new DealsRouterMiddleware();
