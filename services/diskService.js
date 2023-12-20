const axios = require('axios');
const YaToken = 'y0_AgAEA7qkdZTZAADLWwAAAADzcLZwc2pCfCvoTxmIeXiyx7iVK_L7h48';

class DiskService {
    async saveAvatar(filePath) {
        try {
            const response = await axios.post(
                'https://cloud-api.yandex.net/v1/disk/resources/upload',
                '',
                {
                    params: {
                        'path': 'CRM-TEST/' + filePath,
                        'url': 'http://localhost:5000/' + filePath
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'OAuth ' + YaToken
                    }
                }
            );
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new DiskService();