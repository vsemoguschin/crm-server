const { Op } = require('sequelize');
const { Stage } = require('./stagesModel');

class StageController {
  async getOne(req, res, next) {
    try {
      const { stage } = req;
      return res.json(stage);
    } catch (e) {
      next(e);
    }
  }
  async getList(req, res, next) {
    try {
      let { filter } = req;
      if (!filter) {
        filter = { id: { [Op.gt]: 0 } };
      }
      const stages = await Stage.findAll({
        where: filter,
      });
      res.json(stages);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StageController();
