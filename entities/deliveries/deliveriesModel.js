const sequelize = require('../db');
const { DataTypes, BOOLEAN } = require('sequelize');

const DeliveryMethods = ['sdek', 'post', 'courier', 'baltCourier', 'self'];
const DeliveryTypes = [true, false]; // boolen

const Delivery = sequelize.define('delivery', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    method: { type: DataTypes.STRING, allowNull: false },
    paidDelivery: { type: DataTypes.STRING, defaultValue: false },
    description: { type: DataTypes.STRING, allowNull: true },
    info: { type: DataTypes.STRING, allowNull: true },
    city: {type: DataTypes.STRING, allowNull: false},
    price: { type: DataTypes.INTEGER },
    track: { type: DataTypes.INTEGER },
    isDone: { type: DataTypes.BOOLEAN, defaultValue: false },
    //client or phone?
});

module.exports = Delivery;
