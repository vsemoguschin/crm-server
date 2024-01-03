const User = require('./users/usersModel');
const Client = require('./clients/clientsModel');
const Deal = require('./deals/dealsModel');
const Payment = require('./payments/paymentsModel');
const Order = require('./orders/ordersModel');
const TokenSchema = require('./token/tokenModel');
const Dop = require('./dops/dopsModel');
const Delivery = require('./deliveries/deliveriesModel');
const File = require('./files/filesModel');
const { WorkSpace, workSpacesList } = require('./workSpaces/workSpacesModel');
const { Stage, stageList } = require('./stages/stagesModel');

User.hasMany(Deal);
Deal.belongsTo(User);

User.hasOne(WorkSpace);
User.belongsTo(WorkSpace);

User.hasMany(Client);
Client.belongsTo(User);

User.hasOne(TokenSchema);
TokenSchema.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

User.hasMany(Dop);
Dop.belongsTo(User);

Client.hasMany(Deal);
Deal.belongsTo(Client);

Deal.hasMany(Order);
Order.hasOne(Deal);

Deal.hasMany(Dop);
Dop.belongsTo(Deal);

Deal.hasMany(Payment);
Payment.belongsTo(Deal);

Order.belongsTo(Stage);

Delivery.hasMany(Order);
Order.belongsTo(Delivery);

WorkSpace.hasMany(Order);
Order.belongsTo(WorkSpace);

// Files
File.hasOne(User);
User.hasMany(File);
const OrderUserAssociation = Order.belongsToMany(User, { through: 'orderUsers', as: 'executors' });
const UserOrderAssociation = User.belongsToMany(Order, { through: 'userOrders' });

File.hasOne(Deal);
Deal.hasMany(File);
const DraftAssociation = Deal.belongsTo(File, { as: 'draft', foreignKey: 'draftId' });
const DraftOrderAssociation = Order.belongsTo(File, { as: 'draft', foreignKey: 'draftId' });

File.hasOne(Order);
Order.hasMany(File);

module.exports = {
  User,
  Client,
  Deal,
  Order,
  Dop,
  Payment,
  stageList,
  Stage,
  Delivery,
  WorkSpace,
  File,
  workSpacesList,
  DraftAssociation,
  DraftOrderAssociation,
  UserOrderAssociation,
  OrderUserAssociation,
  DraftOrderAssociation,
};
