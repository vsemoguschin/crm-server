const TokenSchema = require('./token/tokenModel');
const { User } = require('./users/usersModel');
const { Role } = require('./roles/rolesModel');
const { Client } = require('./clients/clientsModel');
const { Deal } = require('./deals/dealsModel');
const { Payment } = require('./payments/paymentsModel');
const { Dop } = require('./dops/dopsModel');
const { Delivery } = require('./deliveries/deliveriesModel');
const { File } = require('./files/filesModel');
const { Order } = require('./orders/ordersModel');
// const { Gift } = require('./gifts/giftsModel');
const { Neon } = require('./neons/neonsModel');
const { WorkSpace } = require('./workSpaces/workSpacesModel');
const { Stage, stageList } = require('./stages/stagesModel');

//Пользователи
User.hasOne(TokenSchema);
TokenSchema.belongsTo(User);

// User.hasOne(Role);
Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Client);
Client.belongsTo(User);

User.hasMany(Deal);
Deal.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

User.hasMany(Dop);
Dop.belongsTo(User);

User.hasMany(Neon);
Neon.belongsTo(User);

User.hasMany(Order);
Order.belongsToMany(User, { through: 'ordersExecutors', as: 'executors', foreignKey: 'orderId' });
User.belongsToMany(Order, { through: 'ordersExecutors', as: 'work', foreignKey: 'userId' });

User.hasMany(File);
File.belongsTo(User);
User.belongsTo(File, { as: 'avatar' });

//Клиенты
Client.hasMany(Deal);
Deal.belongsTo(Client);

//Сделки
Deal.hasMany(Order);
Order.belongsTo(Deal);

// Deal.hasMany(Gift);
// Gift.belongsTo(Deal);

Deal.hasMany(Dop);
Dop.belongsTo(Deal);

Deal.hasMany(Payment);
Payment.belongsTo(Deal);

Deal.hasMany(Delivery);
Delivery.belongsTo(Deal);

Deal.hasMany(File);
File.belongsTo(Deal);

//Доставки
Delivery.hasMany(Order);
Order.belongsTo(Delivery);

Delivery.belongsTo(User, { as: 'sender' });

//Заказы
Order.hasMany(Neon);
Neon.belongsTo(Order);

Order.hasMany(File);
File.belongsTo(Order);

//Стадии
Stage.hasMany(Order);
Order.belongsTo(Stage);

//Рабочие пространства
// User.hasMany(WorkSpace);
WorkSpace.belongsToMany(User, { through: 'WorkSpaceMembers', as: 'members', foreignKey: 'workSpaceId' });
User.belongsToMany(WorkSpace, { through: 'WorkSpaceMembers', as: 'membership', foreignKey: 'userId' });
WorkSpace.belongsTo(User, { as: 'creator' });

WorkSpace.hasMany(Order); //для производства
Order.belongsTo(WorkSpace);

WorkSpace.hasMany(Delivery); //для производства
Delivery.belongsTo(WorkSpace);

WorkSpace.hasMany(Client); //для отдела комерции
Client.belongsTo(WorkSpace);

WorkSpace.hasMany(Deal); //для отдела комерции
Deal.belongsTo(WorkSpace);

module.exports = {
  User,
  Role,
  Client,
  Deal,
  Order,
  // Gift,
  Neon,
  Dop,
  Payment,
  stageList,
  Stage,
  Delivery,
  WorkSpace,
  File,
};
