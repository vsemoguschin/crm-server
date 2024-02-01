const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const width = ['6', '8'];
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
];

const types = ['уличный', 'смарт', 'подсветка', 'обычный'];

['width', 'length', 'color', 'type', ]
const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  width: { type: DataTypes.STRING, valdateFields: width, fieldType: 'number', fullName: 'Толщина неона'},
  length: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Длина неона'},
  color: { type: DataTypes.STRING, allowNull: false, valdateFields: colors, fieldType: 'string'},
  type: { type: DataTypes.STRING, allowNull: false, valdateFields: types, fieldType: 'string'}, // берется из ордера или если цвет
};

console.log(JSON.stringify([
  {
    width: '6',
    length: 2,
    color: 'смарт',
    type: 'обычный'
  },
  {
    width: '8',
    length: 2,
    color: 'смарт',
    type: 'обычный'
  },
]));

const Neon = sequelize.define('neon', modelFields);

module.exports = {
  Neon,
  modelFields
};
