const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const materials = ['Полик', 'ПВХ'];
const adapters = ['12v'];
const statuses = ['В работе', 'Доступный', 'Выполнен'];

const modelFields = {
  //придумать как выводить копии
  //в одном заказе может быть несколько типов неона, цветов
  //клиент или маркетплейс
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название заказа' },
  description: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Описание' },
  material: { type: DataTypes.STRING, defaultValue: materials[0], validateFields: materials, fieldType: 'string', fullName: 'Материал подложки' },
  elements: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Колличество элементов' },
  boardWidth: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Ширина подложки' },
  boardHeight: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Высота подложки' },
  wireLength: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Длина провода' },
  dimer: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Димер' },
  adapter: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: adapters[0],
    fieldType: 'string',
    validateFields: adapters,
    fullName: 'Блок',
  },
  status: { type: DataTypes.STRING, defaultValue: statuses[0], fieldType: 'string', validateFields: statuses },
  // instaledBlock
};

const Order = sequelize.define('order', modelFields, { paranoid: true });

module.exports = {
  Order,
  modelFields,
};
