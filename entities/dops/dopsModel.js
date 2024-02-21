const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const types = ['Подарок', 'Монтаж', 'Крепления', 'Пленка', 'Димер', '8mm']; //может быть ещё любой

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Наименовае допа' },
  type: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Тип допа' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Стоимость' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },
};

const Dop = sequelize.define('dop', modelFields, {
  paranoid: true,
});

module.exports = {
  Dop,
  modelFields,
};
