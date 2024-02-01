const axios = require('axios');
const checkFormat = require('../checking/checkFileFormat');
const YaToken = process.env.YA_DISC;


class DiskService {
  async uploadFile(filePath, file) {
    const encodeFilePath = encodeURI(filePath);
    // console.log(filePath);
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

      const a = await axios.put(data.href, file.data, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      return
      // console.log(a);
    } catch (e) {
      console.log(e);
      throw Error('Ошибка загрузки файла на диск');
    }
  }
  // async publishFile(filePath) {
  //   try {
  //     const encodeFilePath = encodeURI(filePath);
  //   //  return console.log(filePath);;
  //     const response = await axios.put('https://cloud-api.yandex.net/v1/disk/resources/publish',
  //       '',
  //       {
  //         params: {
  //           path: filePath
  //         },
  //         headers: {
  //           'Content-Type': 'text/plain',
  //           'Accept': 'application/json',
  //           'Authorization': 'OAuth ' + YaToken,
  //         }
  //       }
  //     );
  //     return;
  //   } catch (e) {
  //     console.log(e);
  //     throw Error('Ошибка публикации файла на диск');
  //   }
  // }
  async getMetaDatas(filePath) {
    try {
      const encodeFilePath = encodeURI(filePath);
    //  return console.log(filePath);;
    const response = await axios.get('https://cloud-api.yandex.net/v1/disk/resources', {
      params: {
        path: filePath
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'OAuth ' + YaToken
      }
    });
      return response.data;
    } catch (e) {
      console.log(e);
      throw Error('Ошибка получения данных');
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
