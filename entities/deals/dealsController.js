const ApiError = require('../../error/apiError');
const { Deal, User, Client, Payment, File, DraftAssociation, Stage, OrderUserAssociation } = require('../association');
const path = require('path');
const diskService = require('../../services/diskService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const clearEmptyFields = require('../../utils/clearEmptyFields');
const fs = require('fs');

class dealsController {
  async create(req, res, next) {
    try {
      const { new_deal } = req;
      const { previewFormat } = new_deal;
      const { img, draft: draftFile } = req.files;

      const pathToAy = 'EasyCRM/deals/drafts/' + draftFile.name;
      const draftData = { name: draftFile.name, size: draftFile.size, url: pathToAy };
      new_deal.draft = draftData;
      new_deal.preview = '';

      const deal = await Deal.create(new_deal, {
        include: {
          association: DraftAssociation,
          as: 'draft',
        },
      });
      const preview = 'public/deals/id' + deal.id + previewFormat;
      deal.preview = preview;
      deal.save();

      await diskService.uploadFile(pathToAy, draftFile).catch((error) => {
        console.log(error);
        // Возможно надо удалить записись из БД и вернуть им ошибку
      });

      img.mv(path.resolve(preview));

      return res.json(deal);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
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
            include: ['stage', 'executors'],
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
      return res.status(400).json(e);
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

  async update(req, res) {
    try {
      const { img, draft } = req.files || {};
      const updateData = req.updateData;
      const previewFormat = { updateData };

      const deal = await Deal.update(updateData, { where: { id: req.params.id } });

      if (img) {
        console.log(deal.preview);
        await fs.unlink(`/public/deals/${deal.preview}`, (err) => {
          console.log(err);
        });

        const preview = 'public/deals/id' + deal.id + previewFormat;
        img.mv(path.resolve(preview));
      }

      if (draft) {
        diskService.deleteFile(deal.draft.url);

        const pathToAy = 'EasyCRM/deals/drafts/' + draft.name;
        const draftData = { name: draftFile.name, size: draftFile.size, url: pathToAy };
        await draft.setDraft(draftData);

        await diskService.uploadFile(pathToAy, draft);
      }

      return res.json(deal);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {}
}

module.exports = new dealsController();
