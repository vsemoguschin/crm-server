const { Deal, modelFields: dealsModelFields, ClothingMethods, DealSources, Spheres, AdTags, DealDates } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const checkReqQueriesIsNumber = require('../../checking/checkReqQueriesIsNumber');
const ApiError = require('../../error/apiError');
const { Op } = require('sequelize');

class DealsController {
  async create(req, res, next) {
    try {
      const { client, newDeal } = req;

      newDeal.userId = req.requester.id;
      newDeal.workSpaceId = client.workSpaceId;

      const deal = await client.createDeal(newDeal);
      await deal.addDealers(req.requester.id);
      await DealDates.create({ dealId: deal.id });

      return res.json(deal);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { deal } = req;
      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const {
      pageSize,
      current,
      key, //?
      order: queryOrder,
    } = req.query;
    try {
      checkReqQueriesIsNumber({ pageSize, current });
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];

      const { searchParams } = req;
      console.log(searchParams);

      const deals = await Deal.findAndCountAll({
        ...searchParams,
        distinct: true,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(deals, current, pageSize, 'deals');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const updateFields = ['title', 'chatLink', 'clothingMethod', 'deadline', 'description', 'price'];

    try {
      const { deal } = req;

      const body = checkRepeatedValues(deal, req.body);
      const updates = await modelsService.checkUpdates([Deal, dealsModelFields], body, updateFields);

      await deal.update(updates);
      return res.json(deal);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async changeStatus(req, res, next) {
    const statuses = ['createdAt', 'process', 'done', 'readyToSend', 'sent', 'delivered'];
    try {
      const { deal } = req;
      const { dealDate } = deal;
      const { new_status } = req.params;
      // console.log(new Date('2024', '0', '1').toISOString());
      const ress = await DealDates.findAll({
        where: {
          process: {
            [Op.and]: [{ [Op.gte]: new Date('2024', '1') }, { [Op.lte]: new Date('2024', '3') }],
          },
        },
      });
      return res.json(ress);

      // console.log(req.params);
      if (!statuses.includes(new_status, 1)) {
        throw ApiError.BadRequest('wrong status');
      }
      const prevStatus = statuses[statuses.indexOf(new_status) - 1];
      const nextStatus = statuses[statuses.indexOf(new_status) + 1];
      if (dealDate[new_status] !== '') {
        throw ApiError.BadRequest('Уже назначен');
      }
      if (dealDate[prevStatus] == '') {
        throw ApiError.BadRequest('wrong status');
      }
      if (dealDate[nextStatus] !== '' && new_status !== 'delivered') {
        throw ApiError.BadRequest('wrong status');
      }
      await dealDate.update({ [new_status]: new Date() });
      return res.json(dealDate);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { deal } = req;
      const deletedDeal = await deal.destroy();
      // console.log(deletedDeal);
      if (deletedDeal === 0) {
        console.log('Сделка не удалена');
        return res.json('Сделка не удалена');
      }
      console.log('Сделка удалена');
      return res.json('Сделка удалена');
    } catch (e) {
      next(e);
    }
  }
  async getMethods(req, res, next) {
    try {
      const methods = await ClothingMethods.findAll();
      return res.json(methods);
    } catch (e) {
      next(e);
    }
  }
  async createMethods(req, res, next) {
    try {
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [method, created] = await ClothingMethods.findOrCreate({ where: { title } });
      return res.json(method);
    } catch (e) {
      next(e);
    }
  }
  async deleteMethods(req, res, next) {
    try {
      const { methodId } = req.params;
      const method = await ClothingMethods.findOne({ where: { id: methodId } });
      if (method) {
        method.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }

  async getSources(req, res, next) {
    try {
      const { workSpace } = req;
      const sources = await DealSources.findAll({ where: { workSpaceId: workSpace.id } });
      return res.json(sources);
    } catch (e) {
      next(e);
    }
  }
  async createSources(req, res, next) {
    try {
      const { workSpace } = req;
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [source, created] = await DealSources.findOrCreate({
        where: { title, workSpaceId: workSpace.id },
        defaults: { title, workSpaceId: workSpace.id },
      });
      return res.json(source);
    } catch (e) {
      next(e);
    }
  }
  async deleteSources(req, res, next) {
    try {
      const { workSpace } = req;
      const { sourceId } = req.params;
      const source = await DealSources.findOne({ where: { id: sourceId, workSpaceId: workSpace.id } });
      if (source) {
        source.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
  async getSpheres(req, res, next) {
    try {
      const spheres = await Spheres.findAll();
      return res.json(spheres);
    } catch (e) {
      next(e);
    }
  }
  async createSpheres(req, res, next) {
    try {
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [sphere, created] = await Spheres.findOrCreate({ where: { title } });
      return res.json(sphere);
    } catch (e) {
      next(e);
    }
  }
  async deleteSpheres(req, res, next) {
    try {
      const { sphereId } = req.params;
      const sphere = await Spheres.findOne({ where: { id: sphereId } });
      if (sphere) {
        sphere.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
  async getAdTags(req, res, next) {
    try {
      const adTags = await AdTags.findAll();
      return res.json(adTags);
    } catch (e) {
      next(e);
    }
  }
  async createAdTags(req, res, next) {
    try {
      const { title } = req.body;
      if (!title) {
        throw ApiError.BadRequest('title is required');
      }
      const [adTag, created] = await AdTags.findOrCreate({ where: { title } });
      return res.json(adTag);
    } catch (e) {
      next(e);
    }
  }
  async deleteAdTags(req, res, next) {
    try {
      const { adTagId } = req.params;
      const adTag = await Spheres.findOne({ where: { id: adTagId } });
      if (adTag) {
        adTag.destroy();
      }
      return res.json(200);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DealsController();
