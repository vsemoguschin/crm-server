const ApiError = require('../../error/apiError');
const { Deal, User, Client, Payment, File, DraftAssociation, Stage, OrderUserAssociation } = require('../association');
const fs = require('fs-extra');
const path = require('path');
const diskService = require('../../services/diskService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require('../../utils/clearEmptyFields');

class dealsController {
  async create(req, res, next) {
    try {
      const { new_deal } = req;
      const { preview, draft } = new_deal;
      const { img, draft: draftFile } = req.files;
      const draftData = { name: draftFile.name, size: draftFile.size, url: draft };
      new_deal.draft = draftData;

      const deal = await Deal.create(new_deal, {
        include: {
          association: DraftAssociation,
          as: 'draft',
        },
      });

      img.mv(path.resolve('public/deals/' + preview));
      // await diskService.saveAvatar(draftFile.tempFilePath);
      console.log(draftFile);
      draftFile.mv(path.resolve('public/deals/' + draft));

      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      //полная инфа по сделкам
      const deal = await Deal.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'role'],
          },
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'fullName'],
          },
          {
            association: 'orders',
            include: [
              {
                model: Stage,
                as: 'stage',
              },
              {
                association: OrderUserAssociation,
              },
            ],
            separate: true,
            order: [['createdAt', 'DESC']],
          },
          {
            association: 'payments',
            attributes: ['id', 'name'],
          },
          {
            association: 'files',
            attributes: ['id', 'name'],
          },
          {
            association: 'draft',
          },
          {
            association: 'dops',
            attributes: ['id', 'name'],
          },
        ],
      });
      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    const { userId, clientId, pageNumber, size, status } = req.query;
    const { limit, offset } = getPagination(pageNumber, size);
    try {
      const filter = clearEmptyFields({ userId, clientId, status });
      //по периодам(месяц, день, неделя , ...) может есть у sequelize
      // сделки юзеров и их юзеров
      //т.е. найти всех юзеров включая их сделки
      // console.log(filter);
      const deals = await Deal.findAndCountAll({
        where: filter,
        order: ['createdAt'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'role'],
          },
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'fullName'],
          },
          {
            association: 'orders',
            include: [
              {
                model: Stage,
                as: 'stage',
              },
              {
                association: OrderUserAssociation,
              },
            ],
            separate: true,
            order: [['createdAt', 'DESC']],
          },
        ],
        limit,
        offset,
      });
      const resData = getPaginationData(deals, pageNumber, limit, 'deals');
      return res.json(resData);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res) {}

  async delete(req, res) {}
}

module.exports = new dealsController();
