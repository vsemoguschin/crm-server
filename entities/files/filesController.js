const { File } = require('./filesModel');
const diskService = require('../../services/diskService');
const getPaginationData = require('../../utils/getPaginationData');
const getPagination = require('../../utils/getPagination');

class FilesController {
  async create(req, res, next) {
    try {
      const { deal, order } = req;
      const fileDatas = await diskService.uploadFile(req.files.file);
      fileDatas.userId = req.requester.id;
      let file;
      if (req.baseUrl.includes('/deals')) {
        file = await deal.createFile(fileDatas);
      }
      if (req.baseUrl.includes('/orders')) {
        file = await order.createFile(fileDatas);
      }

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
      // console.log(modelSearch);
      const { limit, offset } = getPagination(current, pageSize);
      const order = queryOrder ? [[key, queryOrder]] : ['createdAt'];
      const files = await File.findAndCountAll({
        where: modelSearch,
        order,
        limit: 100000,
        offset,
      });
      // console.log(limit, offset, 324242);
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
