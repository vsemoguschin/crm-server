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
      const { filter, requester } = req;
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
