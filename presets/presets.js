const { User, Client, Deal, WorkSpace, stageList, Stage, DealUsers } = require('../entities/association');
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
        firstContact: 'soon',
      },
      {
        fullName: 'Wildberries',
        phone: '2',
        chatLink: 'https://seller.wildberries.ru/',
        type: 'Marketplace',
        gender: 'IT',
        firstContact: 'soon',
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
      { id: 1, title: 'Краснодар', department: 'PRODUCTION', creatorId: 4 },
      { id: 2, title: 'Москва', department: 'PRODUCTION', creatorId: 4 },
      { id: 3, title: 'Санкт-петербург', department: 'PRODUCTION', creatorId: 4 },
      { id: 4, title: 'ВКонтакте', department: 'COMMERCIAL', creatorId: 3 },
      { id: 5, title: 'Авито', department: 'COMMERCIAL', creatorId: 3 },
    ];
    for (let i = 0; i < workSpacesList.length; i++) {
      const workSpace = await WorkSpace.create(workSpacesList[i]);
      await workSpace.addMembers(workSpacesList[i].creatorId);
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
  async createDatas() {
    const workSpaceVK = await WorkSpace.findOne({ where: { title: 'ВКонтакте' } }); //4
    const workSpaceAvito = await WorkSpace.findOne({ where: { title: 'Авито' } }); //5
    const workSpaceMoscow = await WorkSpace.findOne({ where: { title: 'Москва' } }); //2

    const vkManagers = [6, 7, 9];
    const avitoManagers = [5, 8, 10];
    const moscowWorkers = [11, 12, 13];

    await workSpaceVK.addMembers(vkManagers);
    await workSpaceAvito.addMembers(avitoManagers);
    await workSpaceMoscow.addMembers(moscowWorkers);

    const managers = await User.findAll({
      where: {
        id: [...vkManagers, ...avitoManagers],
      },
      include: 'membership',
    });
    for (let i = 0; i < managers.length; i++) {
      // console.log(managers[i].membership[0].id);
      const clientBlank = {
        fullName: i + 'client',
        phone: 13245 + i,
        chatLink: 'https://vk.com',
        type: 'ООО',
        gender: 'M',
        workSpaceId: managers[i].membership[0].id,
        firstContact: 'soon',
      };
      const dealBlank = {
        title: managers[i].id + 'deal',
        price: 12000 + i * 10,
        clothingMethod: 'someting',
        deadline: 'soon',
        userId: managers[i].id,
      };
      const orderBlank = {
        name: 'someOrder',
        elements: 12,
        boardWidth: 100,
        boardHeight: 100,
        wireLength: 0,
        adapter: 'Нет',
        holeType: 'Нет',
        fittings: 'Нет',
        status: 'Создан',
        userId: managers[i].id,
        workSpaceId: workSpaceMoscow.id,
        stageId: 1,
      };
      const deliveryBlank = {
        method: 'СДЕК',
        type: 'Платно',
        description: 'address',
        city: 'MSC',
        readyToSend: true,
      };
      const client = await managers[i].createClient(clientBlank);
      const deal = await client.createDeal({ ...dealBlank, workSpaceId: client.workSpaceId });
      await deal.addSellers(managers[i]);
      const delivery = await deal.createDelivery(deliveryBlank);
      const order = await deal.createOrder({ ...orderBlank, deliveryId: delivery.id });
      await delivery.addOrders(order);
      await delivery.update({ workSpaceId: order.workSpaceId });
    }
  }
}

module.exports = new Presets();
