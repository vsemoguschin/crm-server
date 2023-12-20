const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const methods = ['cash', 'transfer', 'contract', 'c.o.d.', 'link'];

const Payment = sequelize.define('payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Payment;

