const ApiError = require('../../error/apiError');
const modelsService = require('../../services/modelsService');
const { modelFields: preordersModelFields, Preorder } = require('./preordersModel');
const { Deal } = require('../association');
const { Op } = require('sequelize');
const getKaitenDatas = require('../../services/getCard');

const frontOptions = {
  modelFields: modelsService.getModelFields(preordersModelFields),
};
const permissions = ['ADMIN', 'G', 'KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV'];

class PreordersRouterMiddleware {
  async create(req, res, next) {
    //пост-запрос, в теле запроса(body) передаем строку(raw) в формате JSON
    try {
      const { deal } = req;
      const IsPreorder = await Preorder.findAll({ where: { dealId: deal.id } });
      if (IsPreorder.length !== 0) {
        throw ApiError.BadRequest('У сделки уже есть преордер');
      }
      const datas = await getKaitenDatas(req.body.card_id);

      const firstImageObject = datas.files.reverse().find((item) => {
        return item.url.toLowerCase().endsWith('.png') || item.url.toLowerCase().endsWith('.jpg');
      });

      const fileMaket = datas.files.find((item) => {
        return item.url.toLowerCase().endsWith('.cdr');
      });
      // console.log(1212313, datas.files);
      const preorder = {
        card_id: +datas.id,
        card_link: 'https://easyneonwork.kaiten.ru/' + datas.id,
        description: datas.description,
        preview: firstImageObject.url,
        status: 'new',
        maket: fileMaket.url || '',
      };

      await modelsService.checkFields([Preorder, preordersModelFields], preorder);

      req.preorder = preorder;
      console.dir(preorder);
      next();
      return;
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      // return console.log(req.baseUrl, req.params);
      const { id, orderId } = req.params;
      const order = await Order.findOne({
        where: {
          id: orderId || id,
        },
        include: [
          'neons',
          'files',
          'delivery',
          'stage',
          'workSpace',
          {
            association: 'executors',
            include: 'role',
          },
          {
            model: Deal,
            include: 'files',
          },
        ],
      });
      if (!order) {
        throw ApiError.NotFound('Order not found');
      }
      req.order = order;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PreordersRouterMiddleware();
