const { User, Client, Deal, WorkSpace, workSpacesList, stageList, Stage } = require('../entities/association');
const { Role } = require('../entities/roles/rolesModel');
const { ROLES: rolesList, administration } = require('../entities/roles/rolesList');
const bcrypt = require('bcrypt');

class Presets {
  async createAdmin() {
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3); //хешируем пароль
    return await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        email: process.env.ADMIN_EMAIL,
        fullName: process.env.ADMIN_NAME,
        roleName: 'ADMIN',
        password: hashPassword,
        avatar: '1.jpg',
        roleId: 1,
      },
      paranoid: false,
    });
  }
  async createRoles() {
    for (let i = 0; i < administration.length; i++) {
      await Role.findOrCreate({
        where: { shortName: administration[i].shortName },
        defaults: administration[i],
      });
    }
    for (let i = 0; i < rolesList.length; i++) {
      await Role.findOrCreate({
        where: { shortName: rolesList[i].shortName },
        defaults: rolesList[i],
      });
    }
  }
  async createMarketPlaces() {
    const marketplaces = [
      {
        fullName: 'Ozon',
        phone: '1',
        chatLink: 'https://seller.ozon.ru/app/postings/fbs',
        type: 'Marketplace',
        gender: 'IT',
      },
      {
        fullName: 'Wildberries',
        phone: '2',
        chatLink: 'https://seller.wildberries.ru/',
        type: 'Marketplace',
        gender: 'IT',
      },
    ];
    for (let i = 0; i < marketplaces.length; i++) {
      await Client.findOrCreate({
        where: { phone: marketplaces[i].phone },
        defaults: marketplaces[i],
      });
    }
  }
  async createMarketPlacesDeals() {
    const marketsDeals = [
      {
        title: 'Ozon SPB',
        preview: 'ozon img',
        price: 0,
        clothingMethod: 'yeap',
      },
      {
        title: 'Ozon MSK',
        preview: 'ozon img',
        price: 0,
        clothingMethod: 'yeap',
      },
      {
        title: 'Ozon KRD',
        preview: 'ozon img',
        price: 0,
        clothingMethod: 'yeap',
      },
      {
        title: 'WB SPB',
        preview: 'WB img',
        price: 0,
        clothingMethod: 'yeap',
      },
      {
        title: 'WB MSK',
        preview: 'WB img',
        price: 0,
        clothingMethod: 'yeap',
      },
      {
        title: 'WB KRD',
        preview: 'WB img',
        price: 0,
        clothingMethod: 'yeap',
      },
    ];
    for (let i = 0; i < marketsDeals.length; i++) {
      await Client.findOrCreate({
        where: { phone: marketsDeals[i].phone },
        defaults: marketsDeals[i],
      });
    }
  }
  async createWorkSpaces() {
    for (let i = 0; i < workSpacesList.length; i++) {
      const [workSpace] = await WorkSpace.findOrCreate({
        where: { title: workSpacesList[i].title },
        defaults: workSpacesList[i],
      });
      await workSpace.setCreator(1);
    }
  }
  async createStages() {
    for (let i = 0; i < stageList.length; i++) {
      await Stage.findOrCreate({
        where: { title: stageList[i].title },
        defaults: stageList[i],
      });
    }
  }
}

module.exports = new Presets();
