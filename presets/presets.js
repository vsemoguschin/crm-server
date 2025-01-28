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
        where: { title: stageList[i].title, index: i },
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

      const vkGroup = await Group.create({
        title: 'РОП 1',
        workSpaceId: vk.id,
      });

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
          groupId: vkGroup.id,
        },
        paranoid: false,
      });
      const users = [
        { tg: '@budanovsmr', fullName: 'Буданов Глеб', email: 'budanovsmr', password: 'budanovsmr3' },
        { tg: '@schlampik', fullName: 'Акубекова Татьяна', email: 'schlampik', password: 'schlampik1' },
        { tg: '@AlinaMuiii', fullName: 'Малышева Алина', email: 'AlinaMuiii', password: 'AlinaMuiii6' },
        { tg: '@swipeforcheese', fullName: 'Якушева Устинья', email: 'swipeforcheese', password: 'swipeforcheese2' },
        { tg: '@wwwsamuraycom', fullName: 'Свечников Дмитрий', email: 'wwwsamuraycom', password: 'wwwsamuraycom55' },
        { tg: '@drunklordd', fullName: 'Павлов Владислав', email: 'drunklordd', password: 'drunklordd1231' },
        { tg: '@marina_scher9', fullName: 'Щербакова Марина', email: 'marina_scher9', password: 'marina_scher94345' },
        { tg: '@m_marinella', fullName: 'Матвеева Марина', email: 'm_marinella', password: 'm_marinella6548' },
        { tg: '@Tolmacheva_Ek', fullName: 'Толмачева Екатерина', email: 'Tolmacheva_Ek', password: 'Tolmacheva_Ek2353' },
        { tg: '@vs_exe', fullName: 'Добротин Владимир', email: 'vs_exe', password: 'vs_exe5472245' },
        { tg: '@vlaaa_dushka', fullName: 'Фарисей Влада', email: 'vlaaa_dushka', password: 'vlaaa_dushka675245' },
        { tg: '@itkatrinn', fullName: 'Горячева Катерина', email: 'itkatrinn', password: 'itkatrinn13' },
        { tg: '@Nervin177', fullName: 'Нуретдинов Айдар', email: 'Nervin177', password: 'Nervin17712436' },
        { tg: '@elkhid', fullName: 'Камбиева Елена', email: 'elkhid', password: 'elkhid123126' },
        { tg: '@sdzxydt', fullName: 'Гуляева Валентина', email: 'sdzxydt', password: 'sdzxydt1235' },
        { tg: '@everybody_free', fullName: 'Шугулева Лидия', email: 'everybody_free', password: 'everybody_free231' },
      ];
      for (let i = 0; i < users.length; i++) {
        users[i].roleId = 6;
        users[i].workSpaceId = vk.id;
        users[i].groupId = vkGroup.id;
        users[i].password = await bcrypt.hash(users[i].password, 3);
        await User.create(users[i]);
      }

      //Пользователи производства
      const prod = await WorkSpace.create({
        title: 'Производство',
        department: 'PRODUCTION',
      });
      //Группы производств
      const prodGroups = [{ title: 'Руководители' }, { title: 'Фрезеровка/Пленка' }, { title: 'Сборщики' }, { title: 'Упаковщики' }];
      //пользователи производства
      const prodUsers = [
        //пользователи группы руководителей
        [
          {
            email: 'grishchenko_k',
            fullName: 'Константин Грищенко',
            roleName: 'DP',
            password: 'worship',
            roleId: 11,
            tg: '@grishchenko_k',
          },
          {
            email: 'motyagrazy',
            fullName: 'Матвей Савинов',
            roleName: 'DP',
            password: 'yager',
            roleId: 12,
            tg: '@motyagrazy',
          },
          {
            email: 'AlexJul17',
            fullName: 'Юля Пихтова',
            roleName: 'LOGIST',
            password: 'shreder',
            roleId: 13,
            tg: '@AlexJul17',
          },
        ],
        //пользователи группы фрезеровщиков/Пленка
        [
          {
            email: 'Serg_v_k',
            fullName: 'Сергей Кутузов',
            roleName: 'FRZ',
            password: 'freza',
            roleId: 14,
            tg: '@Serg_v_k',
          },
          {
            email: 'edgar8ml',
            fullName: 'Эдгар Маргарян',
            roleName: 'LAM',
            password: 'plenka',
            roleId: 15,
            tg: '@edgar8ml',
          },
        ],
        //пользователи группы сборщиков
        [
          {
            email: 'Abakarov_Maks',
            fullName: 'Максим Абакаров',
            roleName: 'MASTER',
            password: 'maksmaster',
            roleId: 16,
            tg: '@Abakarov_Maks',
          },
        ],
        //пользователи группы упаковщиков
        [
          {
            email: '@Kirieshkasad',
            fullName: 'Юлия Лыкова',
            roleName: 'PACKER',
            password: 'paсker',
            roleId: 17,
            tg: '@Kirieshkasad',
          },
        ],
      ];
      for (let i = 0; i < prodGroups.length; i++) {
        const group = await Group.create({
          title: prodGroups[i].title,
          workSpaceId: prod.id,
        });
        const groupUsers = prodUsers[i];
        for (let j = 0; j < groupUsers.length; j++) {
          await User.findOrCreate({
            where: { email: groupUsers[j].email },
            defaults: {
              ...groupUsers[j],
              password: await bcrypt.hash(groupUsers[j].password, 3),
              workSpaceId: prod.id,
              groupId: group.id,
            },
            paranoid: false,
          });
        }
      }

      //Пользователи отдела ведения
      const ltv = await WorkSpace.create({
        title: 'Ведение',
        department: 'COMMERCIAL',
      });
      const ltvGroups = [{ title: 'Ведение' }];
      const ltvGroup = await Group.create({
        title: ltvGroups[0].title,
        workSpaceId: ltv.id,
      });
      const ltvUsers = [
        {
          email: 'Михаил',
          fullName: 'Михаил',
          roleName: 'ROV',
          password: 'ltv',
          roleId: 7,
          tg: '@Михаил',
        },
        {
          email: 'tzshnik',
          fullName: 'Заполнитель тз',
          roleName: 'MTZ',
          password: 'mtz',
          roleId: 18,
          tg: '@tzshnik',
        },
        {
          email: 'mov',
          fullName: 'менеджер ведения',
          roleName: 'MOV',
          password: 'mov',
          roleId: 8,
          tg: '@mov',
        },
      ];
      for (let i = 0; i < ltvUsers.length; i++) {
        await User.findOrCreate({
          where: { email: ltvUsers[i].email },
          defaults: {
            ...ltvUsers[i],
            password: await bcrypt.hash(ltvUsers[i].password, 3),
            workSpaceId: ltv.id,
            groupId: ltvGroup.id,
          },
          paranoid: false,
        });
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
      { email: 'Romanova', fullName: 'Романова Анна', password: '674467', tg: '@paketikNuri' },
      { email: 'Abramova', fullName: 'Абрамова Анастасия', password: '486447', tg: '@vassabi385' },
      { email: 'Vinichenko', fullName: 'Виниченко Анастасия', password: '356525', tg: '@mrs_vinichenko' },
      { email: 'Shemetova', fullName: 'Шеметова Ангелина', password: '854567', tg: '@Mea0duw' },
      { email: 'Talipova', fullName: 'Талипова Алена', password: '648557', tg: '@alenaTALIPOVA' },
      { email: 'Alyokhina', fullName: 'Алехина Мария', password: '485056', tg: '@AAAlexina' },
      { email: 'sh1ro', fullName: 'Караваева Дарья', password: '446434', tg: '@shiR0_x' },
      { email: 'senya', fullName: 'Завьялов Арсений', password: '043718', tg: '@SH1D44' },
      { email: 'zmeya', fullName: 'Никонова Валерия', password: '654767', tg: '@zmeinova' },
      { email: 'ekaterina', fullName: 'Дрибакова Екатерина', password: '965844', tg: '@FoxStrange' },
      { email: '.mosendz', fullName: 'Мосендз Михаил', password: '473569', tg: '@kiotolaw' },
      { email: 'nyocry', fullName: 'Томилова Елена', password: '674587', tg: '@nyocry' },
      { email: 'smetanina', fullName: 'Сметанина Варвара', password: '345646', tg: '@ryutaishere' },
      { email: 'kashirinaya', fullName: 'Каширина Яна', password: '448565', tg: '@kashirinaya' },
      { email: 'yana.skm', fullName: 'Вьюшина Яна', password: '379856', tg: '@yanatello' },
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
