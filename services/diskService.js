const YaToken = process.env.YA_DISC;
const ApiError = require('../error/apiError');
const axios = require('axios');
const uuid = require('uuid');
const checkFileFormat = require('../checking/checkFileFormat');

class DiskService {
  async uploadFile(file) {
    try {
      const { directory, format } = checkFileFormat(file.name);
      if (!format) {
        console.log(false, 'wrong format');
        throw ApiError.BadRequest('wrong format');
      }
      const uuidName = uuid.v4();
      const filePath = 'EasyCRM/' + directory + '/' + uuidName + '.' + format;
      const { data } = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/upload', {
        params: {
          path: filePath,
          overwrite: true,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'OAuth ' + YaToken,
        },
      });
      console.log('1');

      await axios.put(data.href, file.data, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      console.log(2);

      const response = await axios.get('https://cloud-api.yandex.net/v1/disk/resources', {
        params: {
          path: filePath,
        },
        headers: {
          Accept: 'application/json',
          Authorization: 'OAuth ' + YaToken,
        },
      });
      // console.log(response.data);
      let url;
      if (directory === 'documents' || directory === 'drafts') {
        url = response.data.file;
      }
      if (directory === 'imgs') {
        url = response.data.sizes[0].url;
      }
      return {
        name: file.name,
        ya_name: uuidName + '.' + format,
        size: response.data.size,
        preview: response.data.preview || null,
        url,
        type: directory,
      };
    } catch (e) {
      console.log(e);
      throw ApiError.BadRequest('Ошибка загрузки файла на диск');
    }
  }
  async deleteFile(filePath) {
    try {
      await axios.delete('https://cloud-api.yandex.net/v1/disk/resources', {
        params: {
          path: '/EasyCRM/' + filePath,
          permanently: 'true',
        },
        headers: {
          Accept: 'application/json',
          Authorization: 'OAuth ' + YaToken,
        },
      });
    } catch (e) {
      throw ApiError.BadRequest('Ошибка удаления файла с диска');
    }
  }
  async downloadFile(req, res) {
    try {
      const {
        data: { href },
      } = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/download', {
        params: {
          path: '/EasyCRM/' + req.fileName,
          permanently: 'true',
        },
        headers: {
          Accept: 'application/json',
          Authorization: 'OAuth ' + YaToken,
        },
      });
      res.json({ href });
    } catch (e) {
      throw ApiError.BadRequest('Ошибка удаления файла с диска');
    }
  }
}

module.exports = new DiskService();
