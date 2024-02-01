const { Neon, modelFields: neonsModelFields } = require('./neonsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
class NeonsController {
  async create(req, res, next) {
    try {
      const { newNeon } = req;
      const neon = await Neon.create({
        ...newNeon,
        userId: req.user.id,
        orderId: req.params.id,
      });
      // return res.json(neon);
    } catch (e) {
      console.log(e);
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const neon = await Neon.findOne({
        where: {
          id,
        },
      });
      return res.json(neon);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key,//?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ["createdAt"];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);
      const neons = await Neon.findAndCountAll({
        where: filter,
        order,
        limit,
        offset,
        // include: 'neons',
      });
      const response = getPaginationData(
        neons,
        pageNumber,
        pageSize,
        "neons"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(neonsModelFields, req.body, req.updateFields);
      
      const [updated, neon] = await Neon.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(neon)
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedNeon = await Neon.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedNeon);
      if (deletedNeon === 0) {
        console.log('Неон не удален');
        return res.json('Неон не удален');
      }
      console.log('Неон удален');
      return res.json('Неон удален');
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new NeonsController();
