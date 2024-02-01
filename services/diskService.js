const ApiError = require('../error/apiError');
const axios = require('axios');
const YaToken = process.env.YA_DISC;
const uuid = require('uuid');
const checkFileFormat = require('../checking/checkFileFormat');

class FilesService {
    async uploadFile(directory, file) {
        try {
            const format = checkFileFormat(file.name, directory);
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
                    path: filePath
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'OAuth ' + YaToken
                }
            });
            // console.log(response.data);
            let url;
            if (directory === 'documents'
            || directory === 'drafts') {
                url = response.data.file
            };
            if (directory === 'previews'
            || directory === 'photos') {
                url = response.data.sizes[0].url
            }
            return {
                name: file.name,
                ya_name: uuidName + '.' + format,
                size: response.data.size,
                preview: response.data.preview || null,
                url,
                type: directory,
            }
        } catch (e) {
            console.log(e);
            throw ApiError.BadRequest('Ошибка загрузки файла на диск');
        }
    }
    deleteFile(model) {
        return fields;
    }
}

module.exports = new FilesService();
