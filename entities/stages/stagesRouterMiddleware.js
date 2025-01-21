const ApiError = require('../../error/apiError');
const { Stage } = require('./stagesModel');
const { stages, orderUsers, orderStages } = require('../orders/ordersModel');

const stageAccess = {
  ['ADMIN']: [1, 2, 3, 4, 5],
  ['G']: [1, 2, 3, 4, 5],
  ['DP']: [1, 2, 3, 4, 5],
  ['RP']: [1, 2, 3, 4, 5],
  ['FRZ']: [1, 2],
  ['LAM']: [1, 2, 3],
  ['MASTER']: [3, 4],
  ['PACKER']: [4, 5],
};

class StagesRouterMiddleware {
  async getOne(req, res, next) {
    try {
      // const requesterRole = req.requester.role;
      let { id, stageId } = req.params;
      id = stageId || id;
      // if (!stageAccess[requesterRole].includes(id)) {
      //   console.log(false, 'no acces');
      //   throw ApiError.Forbidden('Нет доступа');
      // }
      const stage = await Stage.findOne({
        where: {
          id: id,
        },
      });
      if (!stage) {
        throw ApiError.NotFound('Stage не найдена');
      }
      req.stage = stage;
      // req.stageAccess = stageAccess[requesterRole];
      next();
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      const requesterRole = req.requester.role;
      if (!stageAccess[requesterRole]) {
        console.log(false, 'no acces');
        throw ApiError.Forbidden('Нет доступа');
      }
      const stageFilter = stageAccess[requesterRole];
      const filter = {
        id: stageFilter,
      };
      req.filter = filter;
      next();
    } catch (e) {
      next(e);
    }
  }
  async moveOrder(req, res, next) {
    try {
      // return console.log(232324);
      const { order } = req;
      const { stageId } = req.params;
      await order.update({ stageId });

      return res.status(200).json('success');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StagesRouterMiddleware();
