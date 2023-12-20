const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const types = ['present', 'mounting', 'fittings', 'lamination', 'dimer', '8mm'];

const Dop = sequelize.define('dop', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Dop;

