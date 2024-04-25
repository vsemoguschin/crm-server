const { Deal, modelFields: dealsModelFields, Dealers, ClothingMethods, DealSources, Spheres, AdTags, DealDates } = require('./dealsModel');
const modelsService = require('../../services/modelsService');
const getPagination = require('../../utils/getPagination');
const checkRepeatedValues = require('../../checking/checkRepeatedValues');
const ApiError = require('../../error/apiError');

const planService = require('../../services/planService');

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

      await planService.createDeal(deal);

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
    try {
      const { searchParams, searchFilter, sortFilter, pageSize, current, managerFilter } = req;
      const { limit, offset } = getPagination(current, pageSize);

      const deals = await Deal.findAndCountAll({
        ...searchParams,
        distinct: true,
        order: [['createdAt', 'DESC']],
      });

      const availableFilters = [
        { query: 'source', name: 'Источник', items: [] },
        { query: 'adTag', name: 'Тег', items: [] },
        { query: 'firstPayment', name: 'Тип платежа', items: [] },
        { query: 'city', name: 'Город', items: [] },
        { query: 'clothingMethod', name: 'Метод закрытия', items: [] },
        { query: 'clientType', name: 'Тип клиента', items: [] },
        { query: 'sphere', name: 'Сфера', items: [] },
        { query: 'discont', name: 'Скидка', items: [] },
        { query: 'status', name: 'Статус', items: [] },
        { query: 'paid', name: 'Оплачена', items: [] },
        { query: 'workspace', name: 'Пространство', items: [] },
      ];

      const dealsList = deals.rows
        .map((el) => {
          const { id } = el;
          const title = el.title; //Название
          const price = el.price; //Стоимость сделки
          const dopsPrice = el.dops.reduce((a, b) => a + b.price, 0); //сумма допов
          const payments = el.payments.reduce((a, b) => a + b.price, 0); //внесенных платежей
          const totalPrice = price + dopsPrice; //Общяя сумма
          const remainder = totalPrice - payments; //Остаток
          const managers = el.dealers; //менеджер(ы)
          const source = el.source; //источник сделки
          const adTag = el.adTag; //тег рекламный
          const firstPayment = el.payments[0]?.method || ''; //метод первого платежа
          const city = el.city;
          const clothingMethod = el.clothingMethod;
          const clientType = el.client.type;
          const chatLink = el.client.chatLink;
          const sphere = el.sphere;
          const discont = el.discont;
          const status = el.status;
          const paid = el.paid;
          const delivery = el.deliveries; //полностью
          const workspace = el.workSpace.title;
          const client = el.client; //передаю полность
          const workspaceId = el.workSpace.id;

          function fillSorting(fields) {
            // console.log(fields);
            for (const field in fields) {
              availableFilters.find((el) => {
                console.log(el.query, field);
                if (el.query == field && !el.items.includes(fields[field]) && fields[field] !== '') {
                  el.items.push(fields[field]);
                }
              });
              // if (!availableFilters[field].includes(fields[field])) {
              //   availableFilters[field].push(fields[field]);
              // }
            }
          }

          fillSorting({
            source,
            adTag,
            firstPayment,
            city,
            clothingMethod,
            clientType,
            sphere,
            discont,
            status,
            paid,
            workspace,
          });

          return {
            id,
            title,
            totalPrice,
            price,
            clientType,
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
            chatLink,
          };
        })
        .filter((deal) => {
          // console.log(deal.managers);
          for (const key in searchFilter) {
            if (deal[key] === undefined || deal[key] != searchFilter[key]) return false;
          }
          if (managerFilter) {
            const { managers } = deal;
            for (let i = 0; i < managers.length; i++) {
              if (managers[i] === undefined || managers[i].id !== +managerFilter.managerId) return false;
            }
            return true;
          }

          return true;
        });

      if (sortFilter.apply === true && sortFilter.key !== null) {
        dealsList.sort((a, b) => {
          if (sortFilter.order == 'ASC') {
            return b[sortFilter.key] - a[sortFilter.key];
          }
          return a[sortFilter.key] - b[sortFilter.key];
        });
      }

      const totalInfo = {
        totalPrice: 0,
        price: 0,
        dopsPrice: 0,
        payments: 0,
        remainder: 0,
      };

      dealsList.map((el) => {
        totalInfo.totalPrice += el.totalPrice;
        totalInfo.price += el.price;
        totalInfo.dopsPrice += el.dopsPrice;
        totalInfo.payments += el.payments;
        totalInfo.remainder += el.remainder;
      });

      const arrayOffset = (current || 1) * (pageSize || 10); // сколько пропустить
      const arrayStart = arrayOffset - limit; //начало
      const arrayEnd = arrayStart + (pageSize || 100); //end

      const resp = {
        total: dealsList.length,
        deals: dealsList.slice(arrayStart, arrayEnd),
        totalPages: Math.ceil(dealsList.length / limit),
        current: current ? +current : 0,
        totalInfo,
        availableFilters,
      };

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
        const newPrice = updates.price;

        if (dealers.length == 2) {
          throw ApiError.BadRequest('delete one seller first');
        }
        await planService.updateDeal(deal, newPrice, next);
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
      await planService.deleteDeal(deal);
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
console.log(new Date('2024-02'), 11111);
console.log(new Date('2024', '2'), 22222);
module.exports = new DealsController();
