const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const widths = ['6мм', '8мм', 'Подсветка'];
const colors = [
  'красный',
  'синий',
  'голубой',
  'оранжевый',
  'фиолетовый',
  'розовый',
  'бирюзовый',
  'желтый',
  'зеленый',
  'холодный белый',
  'теплый белый',
  'смарт',
  'rgb',
];

const types = ['Стандарт', 'Улица', 'РГБ', 'Подсветка', 'РГБ подсветка', 'Смарт'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  width: { type: DataTypes.STRING, defaultValue: '6мм', valdateFields: widths, fieldType: 'string', fullName: 'Толщина неона' },
  length: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Длина неона' },
  color: { type: DataTypes.STRING, allowNull: false, valdateFields: colors, fieldType: 'string', fullName: 'Цвет неона' },
  type: { type: DataTypes.STRING, defaultValue: types[0], valdateFields: types, fieldType: 'string', fullName: 'type' }, // берется из ордера или если цвет
  elements: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Колличество элементов' }, // если комбинировать
};

const Neon = sequelize.define('neon', modelFields);

module.exports = {
  Neon,
  modelFields,
};
