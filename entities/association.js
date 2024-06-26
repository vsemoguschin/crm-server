const TokenSchema = require('./token/tokenModel');
const { WorkSpace } = require('./workSpaces/workSpacesModel');
const { User } = require('./users/usersModel');
const { ManagersPlan } = require('./managers/managersModel');
const { Group } = require('./groups/groupsModel');
const { Role } = require('./roles/rolesModel');
const { Client } = require('./clients/clientsModel');
const { Deal, Dealers, DealSources, DealDates } = require('./deals/dealsModel');
const { Payment } = require('./payments/paymentsModel');
const { Dop, DopsTypes } = require('./dops/dopsModel');
const { Delivery } = require('./deliveries/deliveriesModel');

//Пользователи
User.hasOne(TokenSchema);
TokenSchema.belongsTo(User);

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Client);
Client.belongsTo(User);

User.hasMany(Deal);
Deal.belongsTo(User);

//планы
User.hasMany(ManagersPlan);
ManagersPlan.belongsTo(User);

Group.hasMany(ManagersPlan);
ManagersPlan.belongsTo(Group);

WorkSpace.hasMany(ManagersPlan);
ManagersPlan.belongsTo(WorkSpace);

Deal.belongsToMany(User, { through: 'dealUsers', as: 'dealers', foreignKey: 'dealId' });
User.belongsToMany(Deal, { through: 'dealUsers', as: 'seles', foreignKey: 'userId' });

WorkSpace.hasMany(Group);
Group.belongsTo(WorkSpace);

Group.hasMany(User);
User.belongsTo(Group);

WorkSpace.hasMany(User);
User.belongsTo(WorkSpace);

User.hasMany(Payment);
Payment.belongsTo(User);

User.hasMany(Dop);
Dop.belongsTo(User);

//Клиенты
Client.hasMany(Deal);
Deal.belongsTo(Client);

Deal.hasOne(DealDates);
DealDates.belongsTo(Deal);

WorkSpace.hasMany(DealSources);
DealSources.belongsTo(WorkSpace);

Deal.hasMany(Dop);
Dop.belongsTo(Deal);

Deal.hasMany(Payment);
Payment.belongsTo(Deal);

Deal.hasMany(Delivery);
Delivery.belongsTo(Deal);

Delivery.belongsTo(User, { as: 'sender' });

//Рабочие пространства
// WorkSpace.belongsToMany(User, { through: 'WorkSpaceMembers', as: 'members', foreignKey: 'workSpaceId' });
// User.belongsToMany(WorkSpace, { through: 'WorkSpaceMembers', as: 'membership', foreignKey: 'userId' });
// WorkSpace.belongsTo(User, { as: 'creator' });

WorkSpace.hasMany(Delivery); //для производства
Delivery.belongsTo(WorkSpace);

WorkSpace.hasMany(Client); //для отдела комерции
Client.belongsTo(WorkSpace);

Group.hasMany(Client); //для отдела комерции
Client.belongsTo(Group);

WorkSpace.hasMany(Deal); //для отдела комерции
Deal.belongsTo(WorkSpace);

Group.hasMany(Deal); //для отдела комерции
Deal.belongsTo(Group);

module.exports = {
  WorkSpace,
  Group,
  User,
  Role,
  Client,
  Deal,
  Dop,
  Payment,
  Delivery,
  Dealers,
  ManagersPlan,
  DopsTypes,
};
