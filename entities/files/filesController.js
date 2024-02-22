const { File } = require('./filesModel');
const diskService = require('../../services/diskService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');

class FilesController {
  async create(req, res, next) {
    try {
      const { modelId } = req;
      const fileDatas = await diskService.uploadFile(req.files.file);
      const file = await File.create({
        ...fileDatas,
        ...modelId,
      });

      return res.json(file);
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
      let modelSearch;
      if (req.baseUrl.includes('/deals') && req.params.id && !isNaN(+req.params.id)) {
        modelSearch = { dealId: +req.params.id };
      }
      if (req.baseUrl.includes('/orders') && req.params.id && !isNaN(+req.params.id)) {
        modelSearch = { orderId: +req.params.id };
      }
      console.log(modelSearch);
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];
      const files = await File.findAndCountAll({
        where: modelSearch,
        order,
        limit,
        offset,
      });
      const response = getPaginationData(files, current, pageSize, 'files');
      return res.json(response || []);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      await diskService.deleteFile(req.filePath);
      const { id } = req.params;
      const deletedFile = await File.destroy({
        where: {
          id,
        },
      });
      // console.log(deletedFile);
      if (deletedFile === 0) {
        console.log('Файл не удален');
        return res.json('Файл не удален');
      }
      console.log('Файл удален');
      return res.json('Файл удален');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FilesController();
