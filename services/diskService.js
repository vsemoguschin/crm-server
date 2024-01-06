const axios = require('axios');
const YaToken = 'y0_AgAEA7qkdZTZAADLWwAAAADzcLZwc2pCfCvoTxmIeXiyx7iVK_L7h48';

class DiskService {
  async saveAvatar(filePath) {
    const encodeFilePath = encodeURI(filePath);
    console.log(22222222222222222222222, { file });

    try {
      const { href } = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/upload', {
        params: {
          path: encodeFilePath,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'OAuth ' + YaToken,
        },
      });
      console.log(1111111111111, href);
      await axios.put(href, file, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (e) {
      console.log(e);
      throw Error('Ошибка загрузки файла на диск');
    }
  }
}

module.exports = new DiskService();
