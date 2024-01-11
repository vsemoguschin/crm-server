const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const types = ['present', 'mounting', 'fittings', 'lamination', 'dimer', '8mm'];

const Dop = sequelize.define('dop', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, //title(назначение платежа)
    type: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    // isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }

});

module.exports = Dop;

