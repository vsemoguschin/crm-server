const { Deal, modelFields: dealsModelFields, Dealers, ClothingMethods, DealSources, Spheres, AdTags, DealDates } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const ApiError = require('../../error/apiError');
const { ManagersPlan } = require('../association');

class DealsController {
  async create(req, res, next) {
    try {
      const { client, newDeal } = req;

      newDeal.userId = req.requester.id;
      newDeal.workSpaceId = client.workSpaceId;

      const deal = await client.createDeal(newDeal);
      // await deal.addDealers(req.requester.id);
      await Dealers.create({
        userId: newDeal.userId,
        dealId: deal.id,
        price: newDeal.price,
        part: 1,
      });
      await DealDates.create({ dealId: deal.id });
      const dateObj = new Date();
      const month = dateObj.getUTCMonth() + 1;
      const year = dateObj.getUTCFullYear();

      const [plan] = await ManagersPlan.findOrCreate({
        where: {
          period: new Date(year, month, '0'),
          userId: newDeal.userId,
        },
        defaults: {
          userId: newDeal.userId,
          plan: 0,
          period: new Date(year, month, '0'),
        },
      });

      plan.dealsSales += deal.price;
      plan.dealsAmount += 1;
      await plan.save();

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
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : [['createdAt', 'DESC']];

      const { searchParams, searchFilter } = req;
      // console.log(searchParams);

      const deals = await Deal.findAndCountAll({
        ...searchParams,
        distinct: true,
        order,
        // limit,
        // offset,
      });
      // const deals2 = await Deal.findAndCountAll({
      //   ...searchParams,
      //   attributes: ['id', 'createdAt'],
      //   distinct: true,
      //   order,
      //   limit,
      //   offset,
      // });

      const dealsList = deals.rows
        .map((el) => {
          const { id } = el;
          const title = el.title; //Название
          const dealPrice = el.price; //Стоимость сделки
          const dopsPrice = el.dops.reduce((a, b) => a + b.price, 0); //сумма допов
          const payments = el.payments.reduce((a, b) => a + b.price, 0); //внесенных платежей
          const totalPrice = dealPrice + dopsPrice; //Общяя сумма
          const remainder = totalPrice - payments; //Остаток
          const managers = el.dealers; //менеджер(ы)
          const source = el.source; //источник сделки
          const adTag = el.adTag; //тег рекламный
          const firstPayment = el.payments[0]?.method || ''; //метод первого платежа
          const city = el.city;
          const clothingMethod = el.clothingMethod;
          const client = el.client; //передаю полность
          const sphere = el.sphere;
          const discont = el.discont;
          const status = el.status;
          const paid = el.paid;
          const delivery = el.deliveries; //полностью
          const workspace = el.workSpace.title;
          const workspaceId = el.workSpace.id;

          return {
            id,
            title,
            totalPrice,
            dealPrice,
            dopsPrice,
            payments,
            remainder,
            managers,
            source,
            adTag,
            firstPayment,
            city,
            clothingMethod,
            client,
            sphere,
            discont,
            status,
            paid,
            delivery,
            workspace,
            workspaceId,
          };
        })
        .filter((deal) => {
          for (const key in searchFilter) {
            if (deal[key] === undefined || deal[key] != searchFilter[key]) return false;
          }
          return true;
        });

      const totalInfo = {
        totalPrice: 0,
        dealPrice: 0,
        dopsPrice: 0,
        payments: 0,
        remainder: 0,
      };

      dealsList.map((el) => {
        totalInfo.totalPrice += el.totalPrice;
        totalInfo.dealPrice += el.dealPrice;
        totalInfo.dopsPrice += el.dopsPrice;
        totalInfo.payments += el.payments;
        totalInfo.remainder += el.remainder;
      });

      const arrayOffset = (current || 1) * (pageSize || 10); // сколько пропустить
      const arrayStart = arrayOffset - limit; //начало
      const arrayEnd = arrayStart + (pageSize || 10); //end

      // return console.log('start ' + arrayStart, 'end ' + arrayEnd);
      // console.log(searchFilter);
      const resp = {
        total: dealsList.length,
        deals: dealsList.slice(arrayStart, arrayEnd),
        totalPages: Math.ceil(dealsList.length / limit),
        current: current ? +current : 0,
        totalInfo,
      };

      // const response = getPaginationData(deals2, current, pageSize, 'deals');
      // response.totalInfo = totalInfo;
      // response.deals = dealsList;
      // resp.old = response;
      return res.json(resp);
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
      if (updates.price) {
        const { dealers } = deal;
        const oldPrice = deal.price;
        const newPrice = updates.price;

        const dateObj = new Date(deal.createdAt);
        const month = dateObj.getUTCMonth() + 1;
        const year = dateObj.getUTCFullYear();
        if (dealers.length == 2) {
          throw ApiError.BadRequest('delete one seller first');
        }
        if (dealers.length == 1) {
          const dealer = await Dealers.findOne({ where: { dealId: deal.id } });
          await dealer.update({ price: newPrice });
          const plan = await ManagersPlan.findOne({
            where: {
              userId: deal.dealers[0].id,
              period: new Date(year, month, '0'),
            },
          });
          plan.dealsSales += newPrice - oldPrice;
          await plan.save();
        }
      }
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
      const { dealers } = deal;
      if (dealers.length == 2) {
        throw ApiError.BadRequest('delete one seller first');
      }
      if (deal.payments.length > 0) {
        throw ApiError.BadRequest('deal has payments');
      }
      if (deal.dops.length > 0) {
        throw ApiError.BadRequest('deal has dops');
      }

      const dateObj = new Date(deal.createdAt);
      const month = dateObj.getUTCMonth() + 1;
      const year = dateObj.getUTCFullYear();
      if (dealers.length == 1) {
        await Dealers.destroy({ where: { dealId: deal.id } });
        const plan = await ManagersPlan.findOne({
          where: {
            userId: dealers[0].id,
            period: new Date(year, month, '0'),
          },
        });
        plan.dealsSales -= deal.price;
        plan.dealsAmount -= 1;
        await plan.save();
      }
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
