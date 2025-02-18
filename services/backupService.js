// const useApi = require('../plugins/axios');

class BackupService {
  async Login() {
    try {
      const response = await useApi.post('/login', { email: 'ex@ru', password: 'root' });
      console.log(response);
      console.log('getBackUps');
    } catch (error) {
      console.log(error);
    }
  }
  async getBDDatas() {
    try {
      console.log('getBackUps');
    } catch (error) {
      console.log(error);
    }
  }
  async start() {}
}
module.exports = new BackupService();
