const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const ManagersPlan = sequelize.define('managersPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  period: { type: DataTypes.DATEONLY, allowNull: false, fieldType: 'string', fullName: 'Период' },
  plan: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'План' },
  dealsSales: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Сумма сделок' },
  dealsAmount: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Колличество сделок' },
  dopsSales: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Сумма доп. продаж' },
  dopsAmount: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Колличество доп. продаж' },
  receivedPayments: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Выручка' },
});

module.exports = { ManagersPlan };
