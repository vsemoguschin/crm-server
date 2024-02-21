const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const holeTypes = ['6мм', 'Держатели', 'Нет'];
const fittings = ['Держатели', 'Окно', 'Стена', 'Нет'];
const materials = ['Полик', 'ПВХ'];
const adapters = ['Обыный', 'Уличный', 'Нет'];
const statuses = ['Создан', 'Доступен', 'В работе', 'Отправлен'];
const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  isMarketPlace: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean' },
  name: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название заказа' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },
  material: { type: DataTypes.STRING, defaultValue: materials[0], validateFields: materials, fieldType: 'string', fullName: 'Материал подложки' },
  elements: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Колличество элементов' },
  boardWidth: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Ширина подложки' },
  boardHeight: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Высота подложки' },
  laminate: { type: DataTypes.STRING, defaultValue: false, fieldType: 'string', fullName: 'Пленка' },
  wireLength: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Длина аккустического провода' },
  dimer: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Димер' },
  acrylic: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Акрил' },
  print: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Печать' },
  adapter: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: adapters, fullName: 'Блок' },
  stand: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Подставка' },
  plug: { type: DataTypes.BOOLEAN, defaultValue: true, fieldType: 'boolean', fullName: 'Вилка' },
  holeType: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: holeTypes, fullName: 'Тип отверстий' },
  fittings: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: fittings, fullName: 'Крепления' },
  status: { type: DataTypes.STRING, defaultValue: statuses[0], fieldType: 'string', validateFields: statuses },
  installedAdapter: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', validateFields: adapters, fullName: 'Блок' },
};

const Order = sequelize.define('order', modelFields, { paranoid: true });

module.exports = {
  Order,
  modelFields,
};
