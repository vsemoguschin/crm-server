const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  saleDate: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дата продажи' },
  // title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Наименовае допа' },
  type: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Тип допа' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Стоимость' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },
  period: { type: DataTypes.STRING, defaultValue: new Date().toISOString().slice(0, 7), fieldType: 'string', fullName: 'Период' },
};

const Dop = sequelize.define('dop', modelFields, {
  paranoid: true,
});

const DopsTypes = sequelize.define('dopTypes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Тип допа' },
});

module.exports = {
  Dop,
  DopsTypes,
  modelFields,
};
