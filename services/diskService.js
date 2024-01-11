const axios = require('axios');
const YaToken = 'y0_AgAEA7qkcvrzAADLWwAAAAD3ffQIQaf8Plw0QhqCi-7Zcz02CNT3scc';

class DiskService {
  async uploadFile(filePath, file) {
    const encodeFilePath = encodeURI(filePath);

    try {
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

      await axios.put(data.href, file.data, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (e) {
      console.log(e);
      throw Error('Ошибка загрузки файла на диск');
    }
  }
  async downloadFile(filePath) {
    // const encodeFilePath = encodeURI(filePath);
    const { data } = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/download', {
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

    return data.href;
  }
  deleteFile(filePath) {
    try {
      axios.delete('https://cloud-api.yandex.net/v1/disk/resources', {
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
    } catch (error) {
      console.log('Ошибка удаления файла с Яндекса', error);
    }
  }
}

module.exports = new DiskService();
// const d = new DiskService();
// d.saveAvatar('/deals');
