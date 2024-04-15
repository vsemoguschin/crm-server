const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const ManagersPlan = sequelize.define('managersPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  period: { type: DataTypes.DATE, allowNull: false, fieldType: 'string', fullName: 'Период' },
  plan: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'План' },
});

module.exports = { ManagersPlan };
