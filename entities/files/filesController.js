const { File } = require('./filesModel');
const diskService = require('../../services/diskService');

class FilesController {
  async create(req, res, next) {
    try {
      const fileDatas = await diskService.uploadFile(req.files.file);
      const file = await File.create({
        ...fileDatas,
        dealId: req.params.id,
      });

      return res.json(file);
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res) {
    try {
      await diskService.deleteFile(req.filePath)
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
      next(e)
    }
  }
}

module.exports = new FilesController();
