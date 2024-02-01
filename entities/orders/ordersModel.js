const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const holeTypes = ['6мм', 'под держатели', 'Нет'];
const fittings = ['Дист. держатели', 'Для окон', 'Для стены', 'Нет'];
const materials = ['Полик', 'ПВХ'];
const adapters = ['Обыный', 'Уличный', 'Нет'];
const statuses = ['В работе', 'Доступный', 'Выполнен'];
['elements', 'boardHeight', 'boardWidth', 'wireLength', 'dimer', 'acrylic', 'print', 'laminate', 'adapter', 'plug', 'holeType', 'fittings']
const modelFields = {
  //придумать как выводить копии
  //в одном заказе может быть несколько типов неона, цветов
  //клиент или маркетплейс
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  isMarketPlace: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean' },
  copies: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Число копий'},
  name: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название заказа'},
  description: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Описание'},
  material: { type: DataTypes.STRING, defaultValue: materials[0], validateFields: materials, fieldType: 'string', fullName: 'Материал подложки'},
  elements: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Колличество элементов'},
  boardWidth: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Ширина подложки'},
  boardHeight: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Высота подложки'},
  count: { type: DataTypes.INTEGER, allowNull: false, }, //?
  wireLength: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Длина провода'},
  dimer: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Димер'},
  acrylic: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Акрил'},
  print: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Печать'},
  laminate: { type: DataTypes.STRING, defaultValue: false, fieldType: 'string', fullName: 'Пленка'},
  adapter: {
    type: DataTypes.STRING, allowNull: false, defaultValue: true, fieldType: 'string',
    validateFields: adapters,
    fullName: 'Блок'
  },
  stand: { type: DataTypes.BOOLEAN, defaultValue: true, fieldType: 'boolean', fullName: 'Подставка'}, 
  plug: { type: DataTypes.BOOLEAN, defaultValue: true, fieldType: 'boolean', fullName: 'Вилка'}, 
  holeType: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: holeTypes, fullName: 'Тип отверстий'},
  fittings: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: fittings, fullName: 'Крепления'},
  status: { type: DataTypes.STRING, defaultValue: statuses[0], fieldType: 'string', validateFields: statuses,},
  // instaledBlock
};

const Order = sequelize.define('order', modelFields, {paranoid: true});

module.exports = {
  Order,
  modelFields
};