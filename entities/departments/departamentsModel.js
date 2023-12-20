const sequelize = require('../db')
const { DataTypes } = require('sequelize');

const departamentList = ['KRD', 'MSK', 'SPB'];

const Departament = sequelize.define('departament', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Departament;