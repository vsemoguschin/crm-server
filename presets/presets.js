const { User, Client, Deal, WorkSpace, stageList, Stage, Group } = require('../entities/association');
const { ManagersPlan } = require('../entities/association');
const { Role } = require('../entities/roles/rolesModel');
const { ROLES: rolesList } = require('../entities/roles/rolesList');
const bcrypt = require('bcrypt');
const { Spheres, DealDates, Dealers } = require('../entities/deals/dealsModel');
const { ClothingMethods } = require('../entities/deals/dealsModel');

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
    const [admin] = await User.findOrCreate({
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
    console.log(admin);
    const period = admin.createdAt.toISOString().slice(0, 7);
    await ManagersPlan.create({ userId: admin.id, plan: 500000, period });
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
      await workSpace.addUser(workSpacesList[i].creatorId);
    }
    return;
  }
  async createGroups() {
    const groupsList = [
      { id: 1, title: 'РОП1', workSpaceId: 4 },
      { id: 2, title: 'РОП2', workSpaceId: 5 },
    ];
    for (let i = 0; i < groupsList.length; i++) {
      const group = await Group.create(groupsList[i]);
      await group.addUser(groupsList[i].creatorId);
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
      const [user, created] = await User.findOrCreate({
        where: { email: users[i].email },
        defaults: {
          ...users[i],
          roleId: role.id,
        },
      });
      // console.log(user.id);
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

    await workSpaceVK.addUser(vkManagers);
    await workSpaceAvito.addUser(avitoManagers);
    await workSpaceMoscow.addUser(moscowWorkers);

    const managers = await User.findAll({
      where: {
        id: [...vkManagers, ...avitoManagers],
      },
      include: 'workSpace',
    });
    for (let i = 0; i < managers.length; i++) {
      // console.log(managers[i].membership[0].id);
      const clientBlank = {
        fullName: i + 'client',
        phone: 13245 + i,
        chatLink: 'https://vk.com' + i,
        type: 'ООО',
        gender: 'M',
        workSpaceId: managers[i].workSpace.id,
        firstContact: 'soon',
      };
      const dealBlank = {
        title: managers[i].id + 'deal',
        price: 12000 + i * 10,
        clothingMethod: 'someting',
        deadline: 'soon',
        userId: managers[i].id,
        adTag: '12mckcv',
        discont: 'без',
        source: 'vk',
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
      const paymentsBlank = {
        title: 'first',
        price: 3000,
        date: new Date().toDateString(),
        method: 'Перевод',
      };
      const dopBlank = {
        title: 'first',
        price: 3000,
        type: 'gift',
      };
      //create plan
      const period = managers[i].createdAt.toISOString().slice(0, 7);

      const plan = await ManagersPlan.create({ userId: managers[i].id, plan: 50000, period });

      const client = await managers[i].createClient(clientBlank);
      const deal = await client.createDeal({ ...dealBlank, workSpaceId: client.workSpaceId });

      // await deal.addDealers(managers[i]);
      await Dealers.create({
        userId: managers[i].id,
        dealId: deal.id,
        part: 1,
        price: deal.price,
      });

      await DealDates.create({ dealId: deal.id });
      const delivery = await deal.createDelivery(deliveryBlank);
      const payment = await deal.createPayment({ ...paymentsBlank, userId: managers[i].id });
      const dop = await deal.createDop({ ...dopBlank, userId: managers[i].id });
      // const order = await deal.createOrder({ ...orderBlank, deliveryId: delivery.id });
      // await delivery.addOrders(order);
      // await delivery.update({ workSpaceId: order.workSpaceId });

      plan.dealsSales += deal.price;
      plan.dealsAmount += 1;
      plan.dopsSales += dop.price;
      plan.dopsAmount += 1;
      plan.receivedPayments += payment.price;
      await plan.save();
    }
  }
  async createLists() {
    const spheres = [
      'Физ лицо для себя',
      'Салон красот универсал',
      'Кофейни',
      'Кафе',
      'Шоурум',
      'Физ лицо в подарок',
      'Цветочные магазины',
      'Маникюр',
      'Магазин одежды',
      'Вейпшопы/Табачки',
      'Бары',
      'Рестораны',
      'Танцы',
      'Ремонт телефонов ',
      'Кальянные ',
      'Фотостудии',
      'Компьютерные клубы',
      'Продуктовый магазин',
      'Обслуживание автомобилей',
      'Стритфуд',
      'Фастфуд',
      'Пивные',
      'Парикмахерская',
      'Фитнес центры',
      'Кондитерские',
      'Татту студии',
      'Ресницы',
      'Отель',
      'Парфюмерные ',
      'Барбершоп',
      'Турагентство',
      'YouTube канал',
      'Йога',
      'Зоомагазин',
      'Педикюр',
      'Окрашивания',
    ];
    for (let i = 0; i < spheres.length; i++) {
      console.log(spheres[i]);
      await Spheres.create({ title: spheres[i] });
    }
    const clothingMethods = ['Звонок', 'Пинг', 'Клиент сам вышел на оплату', 'Акция', 'Отработка', 'Бронь'];
    for (let i = 0; i < clothingMethods.length; i++) {
      await ClothingMethods.create({ title: clothingMethods[i] });
    }
  }
  async createStartDatas() {
    try {
      const workspace = await WorkSpace.create({
        title: 'Admin',
        department: 'COMMERCIAL',
      });
      const group = await Group.create({
        title: 'Admin G',
        workSpaceId: workspace.id,
      });
      //Создаем админов
      const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3); //хешируем пароль
      const managers = [];
      await User.findOrCreate({
        where: { email: process.env.ADMIN_EMAIL },
        defaults: {
          email: process.env.ADMIN_EMAIL,
          fullName: process.env.ADMIN_NAME,
          roleName: 'ADMIN',
          password: hashPassword,
          avatar: '1.jpg',
          roleId: 1,
          workSpaceId: workspace.id,
          groupId: group.id,
        },
        paranoid: false,
      });
      const [admin] = await User.findOrCreate({
        where: { email: 'GGG' },
        defaults: {
          email: 'Maxmazunin',
          fullName: 'Максим Мазунин',
          roleName: 'G',
          password: await bcrypt.hash('Maxkud59', 3),
          roleId: 2,
          workSpaceId: workspace.id,
          groupId: group.id,
        },
        paranoid: false,
      });
      await User.findOrCreate({
        where: { email: 'qwertymark337@gmail.com' },
        defaults: {
          email: 'qwertymark337@gmail.com',
          fullName: 'Марк Вансовский',
          roleName: 'KD',
          password: await bcrypt.hash('easyneondir', 3),
          roleId: 3,
          workSpaceId: workspace.id,
          groupId: group.id,
        },
        paranoid: false,
      });

      const avito = await WorkSpace.create({
        title: 'B2B',
        department: 'COMMERCIAL',
      });
      const avitoGroups = [{ title: 'Авито Питер' }, { title: 'Опт отдел' }, { title: 'Москва Неон' }];
      await Promise.all(
        avitoGroups.map(async (g, i) => {
          const group = await Group.create({
            title: g.title,
            workSpaceId: avito.id,
          });
          if (i === 0) {
            await User.findOrCreate({
              where: { email: 'jayz' },
              defaults: {
                email: 'jayz',
                fullName: 'Сергей Иванов',
                roleName: 'DO',
                password: await bcrypt.hash('beyonce', 3),
                roleId: 4,
                tg: '@floype',
                workSpaceId: avito.id,
                groupId: group.id,
              },
              paranoid: false,
            });
          }
        }),
      );

      const vk = await WorkSpace.create({
        title: 'ВК',
        department: 'COMMERCIAL',
      });

      const vkGroups = [{ title: 'РОП 1' }, { title: 'РОП 2' }, { title: 'РОП 3' }];
      for (let i = 0; i < vkGroups.length; i++) {
        const group = await Group.create({
          title: vkGroups[i].title,
          workSpaceId: vk.id,
        });
        let users = [];
        let rop = {};
        if (i === 0) {
          await User.findOrCreate({
            where: { email: 'easKD' },
            defaults: {
              email: 'nablatnom',
              fullName: 'Юлия Куштанова',
              roleName: 'DO',
              password: await bcrypt.hash('nablatnom', 3),
              roleId: 4,
              tg: '@JuliaKush',
              workSpaceId: vk.id,
              groupId: group.id,
            },
            paranoid: false,
          });
          rop = { email: 'AlinaROP1', fullName: 'Алина Малышева РОП 1', password: 'AlinaROP1', tg: '@AlinaMuiii' };

          users = [
            //РОП1
            { email: 'MAXIMPISK', fullName: 'Максим Пискунов', password: 'MAXIMPISK', tg: '@strutstrut' },
            { email: 'USTYA', fullName: 'Устинья Якушева', password: 'USTYA', tg: '@swipeforcheese' },
            { email: 'DIMASVE', fullName: 'Дмитрий Свечников', password: 'DIMASVE', tg: '@wwwsamuraycom' },
            { email: 'DARYAKOV', fullName: 'Дарья Яковлева', password: 'DARYAKOV', tg: '@dashayakovlevady' },
            { email: 'VADIMSAMO', fullName: 'Вадим Самойлов', password: 'VADIMSAMO', tg: '@Haertunderblade' },
            { email: 'MAXANDRO', fullName: 'Максим Андронов', password: 'MAXANDRO', tg: '@kenzikenzi1' },
            { email: 'NASTYAMAY', fullName: 'Анастасия Майорова', password: 'NASTYAMAY', tg: '@nlr_21' },
            { email: 'ZARINA111', fullName: 'Зарина Кузнецова', password: 'ZARINA111', tg: '@ZarinaSl' },
          ];
        }
        if (i === 1) {
          rop = { email: 'VladimirPERM', fullName: 'Владимир Добротин РОП 2', password: 'VladimirPERM', tg: '@vs_exe' };

          users = [
            //РОП2
            { email: 'TANYAGUL', fullName: 'Татьяна Гуляева', password: 'TANYAGUL', tg: '@pysht9999' },
            { email: 'YULYAGAS', fullName: 'Юлия Гасымова', password: 'YULYAGAS', tg: '@juliya0307' },
            { email: 'VALSKOR', fullName: 'Валентина Скорикова', password: 'VALSKOR', tg: '@skorikovav' },
            { email: 'SOFAK', fullName: 'София Карасева', password: 'SOFAK', tg: '@betrothed_wind_1' },
            { email: 'DIANABAR', fullName: 'Диана Баранчук', password: 'DIANABAR', tg: '@mirzakulovadi' },
            { email: 'OLYAKOR', fullName: 'Ольга Короваева', password: 'OLYAKOR', tg: '@olmakar' },
            { email: 'ARILAS', fullName: 'Ариша Ласькова', password: 'ARILAS', tg: '@Arishalaskova' },
            { email: 'ANYANOV', fullName: 'Анна Новикова', password: 'ANYANOV', tg: '@etojeanyaaaaa' },
            { email: 'KATYATOL', fullName: 'Екатерина Толмачева', password: 'KATYATOL', tg: '@Tolmacheva_Ek' },
            { email: 'MAXSOLO', fullName: 'Максим Солодухин', password: 'MAXSOLO', tg: '@Sma_011' },
          ];
        }
        if (i === 2) {
          rop = { email: 'GlebROP3', fullName: 'Глеб Буданов РОП 3', password: 'GlebROP3', tg: 'GlebROP3' };

          users = [
            //РОП3
            { email: 'DANYAKA', fullName: 'Даниил Карпенко', password: 'DANYAKA', tg: '@VZGLSSS' },
            { email: 'POLINARA', fullName: 'Полина Рагозина', password: 'POLINARA', tg: '@lonDeck' },
            { email: 'ELENAKY', fullName: 'Елена Курлова', password: 'ELENAKY', group: 'РОП 3', tg: '@Helllena_k' },
            { email: 'NASTYAZAI', fullName: 'Анастасия Зайцева', password: 'NASTYAZAI', group: 'РОП 3', tg: '@Zaviana' },
          ];
        }
        for (let i = 0; i < users.length; i++) {
          users[i].roleId = 6;
          users[i].workSpaceId = vk.id;
          users[i].groupId = group.id;
          users[i].password = await bcrypt.hash(users[i].password, 3);
          await User.create(users[i]);
        }
        rop.groupId = group.id;
        rop.password = await bcrypt.hash(rop.password, 3);
        rop.workSpaceId = vk.id;
        rop.roleId = 5;
        await User.create(rop);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async createDizDatas() {
    const [workspace] = await WorkSpace.findOrCreate({
      where: { title: 'Дизайн' },
      defaults: {
        title: 'Дизайн',
        department: 'DESIGN',
      },
    });
    const [group] = await Group.findOrCreate({
      where: { title: 'Дизайнеры' },
      defaults: {
        title: 'Дизайнеры',
        workSpaceId: workspace.id,
      },
    });
    const rod = {
      email: 'Lola96408',
      fullName: 'Анна Сергеева',
      password: '2329285',
      tg: '@AnnaDesignCorel',
      roleId: 9,
      workSpaceId: workspace.id,
      groupId: group.id,
    };
    rod.password = await bcrypt.hash(rod.password, 3);
    await User.findOrCreate({
      where: { email: rod.email },
      defaults: rod,
    });
    const users = [
      { email: 'Romanova', fullName: 'Романова Анна', password: '674467', tg: '@paketikNuri)' },
      { email: 'Kozlov', fullName: 'Козлов Владимир', password: '470873', tg: '@Disvo51)' },
      { email: 'Zhmykhov', fullName: 'Жмыхов Михаил', password: '042073', tg: '@MIHAILL404)' },
      { email: 'логин', fullName: 'Семёнова Яна', password: '354567', tg: '@hann_0)' },
      { email: 'Nikolaeva', fullName: 'Николаева Юлия', password: '654784', tg: '@qworu_mail)' },
      { email: 'Ilyasov', fullName: 'Ильясов Ильмир', password: '587137', tg: '@m_phoenix_art)' },
      { email: 'Abramova', fullName: 'Абрамова Анастасия', password: '486447', tg: '@vassabi385)' },
      { email: 'Efremova', fullName: 'Ефремова Алиса', password: '516547', tg: '@Alisson_Pattison)' },
      { email: 'Finogeeva', fullName: 'Финогеева Дарья', password: '156775', tg: '@darfia)' },
      { email: 'Vinichenko', fullName: 'Виниченко Анастасия', password: '356525', tg: '@mrs_vinichenko)' },
      { email: 'Pechersk', fullName: 'Печерских Анастасия', password: '552563', tg: '@nstpech)' },
      { email: 'Prelovskaya', fullName: 'Преловская Анастасия', password: '565873', tg: '@Rimigala)' },
      { email: 'Vavilova', fullName: 'Вавилова Анастасия', password: '343587', tg: '@saraelenaroman)' },
      { email: 'Muromtseva', fullName: 'Муромцева Ксения', password: '343587', tg: '@MuromtsevaKseniya)' },
      { email: 'Shemetova', fullName: 'Шеметова Ангелина', password: '854567', tg: '@Mea0duw)' },
      { email: 'Nikiforova', fullName: 'Никифорова Екатерина', password: '654517', tg: '@Chudowhale)' },
      { email: 'Talipova', fullName: 'Талипова Алена', password: '648557', tg: '@alenaTALIPOVA)' },
      { email: 'Mavrilova', fullName: 'Маврилова Виктория', password: '443658', tg: '@V_mavr)' },
      { email: 'Alyokhina', fullName: 'Алехина Мария', password: '485056', tg: '@AAAlexina)' },
      { email: 'Chezhegova', fullName: 'Чежегова Анна', password: '250577', tg: '@aversa_pars)' },
      { email: 'Baghdarasyan', fullName: 'Багдарасян Адель', password: '847946', tg: '@anileds)' },
    ];
    for (let i = 0; i < users.length; i++) {
      users[i].roleId = 10;
      users[i].workSpaceId = workspace.id;
      users[i].groupId = group.id;
      users[i].password = await bcrypt.hash(users[i].password, 3);
      await User.findOrCreate({
        where: { email: users[i].email },
        defaults: users[i],
      });
    }
  }
}

module.exports = new Presets();
