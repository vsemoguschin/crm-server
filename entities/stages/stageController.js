const { Stage } = require('./stagesModel');

class StageController {
  async getList(req, res, next) {
    const stages = await Stage.findAll();
    res.json(stages);
  }
}

module.exports = new StageController();
