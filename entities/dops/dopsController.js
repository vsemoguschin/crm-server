const { Dop, modelFields: dopsModelFields } = require('./dopsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const { Op } = require('sequelize');
class DopsController {
  async create(req, res, next) {
    try {
      const { newDop } = req;
      const dop = await Dop.create({
        ...newDop,
        userId: req.user.id,
        dealId: req.params.id,
      });
      return res.json(dop);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const dop = await Dop.findOne({
        where: {
          id,
        },
      });
      if (!dop) {
        return res.status(404).json('dop not found');
      }
      return res.json(dop);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      pageNumber,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      const { limit, offset } = getPagination(pageNumber, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchFields } = req;
      const filter = await modelsService.searchFilter(searchFields, req.query);

      let modelSearch = {
        id: { [Op.gt]: 0 },
      };
      if (req.baseUrl.includes('/deals')) {
        modelSearch = { dealId: +req.params.id };
      }
      const dops = await Dop.findAndCountAll({
        where: {
          ...filter,
          ...modelSearch,
        },
        order,
        limit,
        offset,
      });
      const response = getPaginationData(dops, pageNumber, pageSize, 'dops');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(dopsModelFields, req.body, req.updateFields);

      const [, dop] = await Dop.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(dop);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedDop = await Dop.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedDop);
      if (deletedDop === 0) {
        console.log('Доп не удалена');
        return res.json('Доп не удалена');
      }
      console.log('Доп удалена');
      return res.json('Доп удалена');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DopsController();
