const { File, modelFields: fileModelFields } = require('./filesModel');
const modelsService = require('../../services/modelsService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');
const ApiError = require('../../error/apiError');
const fs = require("fs-extra");

class FilesController {

  async create(req, res, next) {
    try {
      const { newFile } = req;
      const file = await File.create({
        ...newFile,
        userId: req.user.id,
        dealId: req.params.id,
      });

      fs.writeFileSync(newFile.url, req.files.file.data, err => {
        if (err) {
          throw ApiError.BadRequest('Wrong');
        };
      });

      return res.json(file);
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const file = await File.findOne({
        where: {
          id,
        },
      });
      return res.json(file);
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
      console.log(filter);
      const files = await File.findAndCountAll({
        where: filter,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(
        files,
        pageNumber,
        pageSize,
        "files"
      );
      return res.json(response || []);
    } catch (e) {
      next(e)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = await modelsService.checkUpdates(fileModelFields, req.body, req.updateFields);

      const [updated, file] = await File.update(updates, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      return res.status(200).json(file)
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedFile = await File.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedFile);
      if (deletedFile === 0) {
        console.log('Доставка не удалена');
        return res.json('Доставка не удалена');
      }
      console.log('Доставка удалена');
      return res.json('Доставка удалена');
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new FilesController();
