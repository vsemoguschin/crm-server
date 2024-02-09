const checkFormat = require('../../checking/checkFormat');
const ApiError = require('../../error/apiError');
const { Order } = require('../association');
const { Deal } = require('../deals/dealsModel');
const { File } = require('./filesModel');

const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class FilesRouterMiddleware {
  async dealsFiles(req, res, next) {
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка значения и наличия сделки/заказа
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const deal = await Deal.findOne({
        where: { id: +req.params.id },
      });
      if (!deal) {
        console.log(false, 'No deal');
        throw ApiError.BadRequest('No deal');
      }
      //проверка на file
      if (!req?.files?.file) {
        console.log(false, 'no files');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      req.modelId = { dealId: +req.params.id };
      next();
    } catch (e) {
      next(e);
    }
  }
  async ordersImgs(req, res, next) {
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!['ADMIN', 'G', 'DP', 'RP', 'MASTER', 'PACKER'].includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка значения и наличия сделки/заказа
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
      }
      const order = await Order.findOne({
        where: { id: +req.params.id },
      });
      if (!order) {
        console.log(false, 'No order');
        throw ApiError.BadRequest('No order');
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
      req.modelId = { orderId: +req.params.id };
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
      next();
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const requester = req.user.role;
      //проверка на доступ к созданию
      if (!permissions.includes(requester)) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      //проверка значения и наличия сделки/заказа
      if (!req.params.id || isNaN(+req.params.id)) {
        console.log(false, 'Забыл что то указать');
        throw ApiError.BadRequest('Забыл что то указать');
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
