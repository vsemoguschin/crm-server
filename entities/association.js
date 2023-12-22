const User = require('./users/usersModel');
const Client = require('./clients/clientsModel');
const Deal = require('./deals/dealsModel');
const Payment = require('./payments/paymentsModel');
const Order = require('./orders/ordersModel');
const TokenSchema = require('./token/tokenModel');
const Dop = require('./dops/dopsModel');
const Delivery = require('./deliveries/deliveriesModel');
const {WorkSpace, workSpacesList} = require('./workSpaces/workSpacesModel');
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
Order.belongsTo(Deal);

Deal.hasMany(Dop);
Dop.belongsTo(Deal);

Deal.hasMany(Payment);
Payment.belongsTo(Deal);

Deal.hasOne(Stage);
Stage.belongsTo(Deal);

Delivery.hasMany(Order);
Order.belongsTo(Delivery);

WorkSpace.hasMany(Order);
Order.belongsTo(WorkSpace)


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
    workSpacesList,
}




