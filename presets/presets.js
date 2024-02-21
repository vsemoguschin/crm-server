const { User, Client, Deal, WorkSpace, stageList, Stage } = require('../entities/association');
const { Role } = require('../entities/roles/rolesModel');
const { ROLES: rolesList } = require('../entities/roles/rolesList');
const bcrypt = require('bcrypt');

class Presets {
  async createAdmin() {
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3); //хешируем пароль
    await User.findOrCreate({
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
    return await User.findOrCreate({
      where: { email: 'GGG' },
      defaults: {
        email: 'GGG',
        fullName: 'MAX',
        roleName: 'G',
        password: await bcrypt.hash('root', 3),
        roleId: 2,
      },
      paranoid: false,
    });
  }
  async createUsers() {
    const users = [
      {
        email: 'mail',
        fullName: 'Mark',
        role: 'KD',
      },
      {
        email: 'mail',
        fullName: 'Sasha',
        role: 'DP',
      },
      {
        email: 'mail',
        fullName: 'Sergey',
        role: 'DO',
      },
      {
        email: 'mail',
        fullName: 'Julia',
        role: 'DO',
      },
      {
        email: 'mail',
        fullName: 'someRop',
        role: 'ROP',
      },
      {
        email: 'mail',
        fullName: 'someRop',
        role: 'ROP',
      },
      {
        email: 'mail',
        fullName: 'someMop',
        role: 'MOP',
      },
      {
        email: 'mail',
        fullName: 'someMop',
        role: 'MOP',
      },
      {
        email: 'mail',
        fullName: 'Dima',
        role: 'RP',
      },
      {
        email: 'mail',
        fullName: 'Arkasha',
        role: 'FRZ',
      },
      {
        email: 'mail',
        fullName: 'Braga',
        role: 'MASTER',
      },
    ];
    const hashPassword = await bcrypt.hash('root', 3);
    for (let i = 0; i < users.length; i++) {
      users[i].email += i;
      users[i].password = hashPassword;
      const role = await Role.findOne({
        where: { shortName: users[i].role },
      });
      await User.findOrCreate({
        where: { email: users[i].email },
        defaults: {
          ...users[i],
          roleId: role.id,
        },
      });
    }
    return;
  }
  async createRoles() {
    for (const role in rolesList) {
      await Role.findOrCreate({
        where: { shortName: role },
        defaults: rolesList[role],
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
    const workSpacesList = [
      { title: 'Краснодар', department: 'PRODUCTION', creatorId: 3 },
      { title: 'Москва', department: 'PRODUCTION', creatorId: 3 },
      { title: 'Санкт-петербург', department: 'PRODUCTION', creatorId: 3 },
      { title: 'ВКонтакте', department: 'COMMERCIAL', creatorId: 2 },
      { title: 'Авито', department: 'COMMERCIAL', creatorId: 2 },
    ];
    for (let i = 0; i < workSpacesList.length; i++) {
      const workSpace = await WorkSpace.findOrCreate({
        where: { title: workSpacesList[i].title },
        defaults: workSpacesList[i],
      });
    }
    return;
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
