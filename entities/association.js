const TokenSchema = require('./token/tokenModel');
const { User } = require('./users/usersModel');
const { Role } = require('./roles/rolesModel');
const { Client } = require('./clients/clientsModel');
const { Deal } = require('./deals/dealsModel');
const { Payment } = require('./payments/paymentsModel');
const { Order } = require('./orders/ordersModel');
const { Neon } = require('./neons/neonsModel');
const { Dop } = require('./dops/dopsModel');
const { Delivery } = require('./deliveries/deliveriesModel');
const File = require('./files/filesModel');
const { WorkSpace, workSpacesList } = require('./workSpaces/workSpacesModel');
const { Stage, stageList } = require('./stages/stagesModel');

//Пользователи
User.hasOne(TokenSchema);
TokenSchema.belongsTo(User);

User.hasOne(Role);
User.belongsTo(Role);

User.hasMany(Client);
Client.belongsTo(User);

User.hasMany(Deal);
Deal.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

User.hasMany(Dop);
Dop.belongsTo(User);

//Клиенты
Client.hasMany(Deal);
Deal.belongsTo(Client);

//Сделки
Deal.hasMany(Order);
Order.belongsTo(Deal);

Deal.hasMany(Dop);
Dop.belongsTo(Deal);

Deal.hasMany(Payment);
Payment.belongsTo(Deal);

Deal.hasMany(Delivery);
Delivery.belongsTo(Deal);

//Заказы
Order.belongsToMany(User, { through: 'userOrder', as: 'executors' });

Order.hasMany(Neon);
Neon.belongsTo(Order);

//Рабочие пространства
WorkSpace.hasMany(User);
User.belongsTo(WorkSpace);

WorkSpace.hasMany(Order);//для производства
Order.belongsTo(WorkSpace);

WorkSpace.hasMany(Deal);//для отдела комерции
Deal.belongsTo(WorkSpace);

//Стадии
Stage.hasMany(Order);
Order.belongsTo(Stage);

//Доставки
Delivery.hasMany(Order);
Order.belongsTo(Delivery);

Delivery.belongsTo(User, { as: 'executor' });






Deal.hasMany(File);
File.belongsTo(Deal, { as: 'doc' })
File.belongsTo(Deal, { as: 'maket' })



// Deal.hasMany(File, { as: 'makets', foreignKey: 'dealId' });
// Deal.hasMany(File, { as: 'imgs', foreignKey: 'dealId' });


// Files
File.hasOne(User);
User.hasMany(File);

// const DraftAssociation = Deal.belongsTo(File, { as: 'draft', foreignKey: 'draftId' });
// const DraftOrderAssociation = Order.belongsTo(File, { as: 'draft', foreignKey: 'draftId' });

File.hasOne(Order);
Order.hasMany(File);

module.exports = {
  User,
  Role,
  Client,
  Deal,
  Order,
  Neon,
  Dop,
  Payment,
  stageList,
  Stage,
  Delivery,
  WorkSpace,
  File,
  workSpacesList,
  // DraftAssociation,
  // DraftOrderAssociation,
  // OrderUserAssociation,
};
