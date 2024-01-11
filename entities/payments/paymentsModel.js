const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const methods = ['cash', 'transfer', 'contract', 'c.o.d.', 'link'];

const Payment = sequelize.define('payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, //title
    price: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    // isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }

});

module.exports = Payment;

