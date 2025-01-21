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
      const stages = await Stage.findAll({ order: [['index', 'ASC']] });
      // console.log(stages);
      res.json(stages);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StageController();
