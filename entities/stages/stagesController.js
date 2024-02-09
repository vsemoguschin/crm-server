const { Stage } = require('./stagesModel');

class StageController {
  async getList(req, res, next) {
    try {
      const { filter } = req;
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
