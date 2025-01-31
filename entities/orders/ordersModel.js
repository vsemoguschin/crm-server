const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const holeTypes = ['6мм', '9мм', 'Нет'];
const fittings = ['Держатели хромированые', 'Держатели золотые', 'Держатели черные', 'Крепления для окна', 'Дюбеля', 'Присоски', 'Нет'];
const materials = ['Поликарбонат', 'ПВХ'];
const types = ['Помещение', 'Улица'];
const adapters = ['Помещение', 'Уличный', 'Нет'];
const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  loadDate: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Дата выгрузки на производство' },
  endDate: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Дата готовности' },
  title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название заказа' },
  material: { type: DataTypes.STRING, defaultValue: materials[0], validateFields: materials, fieldType: 'string', fullName: 'Материал подложки' },
  boardWidth: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Ширина подложки' },
  boardHeight: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Высота подложки' },
  holeType: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: holeTypes, fullName: 'Тип отверстий' },
  stand: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Подставка' },

  laminate: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Пленка' },
  print: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Печать' },
  printQuality: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Качество печати' },
  acrylic: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Акрил' },

  type: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', validateFields: types, fullName: 'Тип' },
  wireLength: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Длина аккустического провода' },
  elements: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Колличество элементов' },
  gift: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Подарок' },
  gift_elements: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Колличество элементов подарка' },
  gift_metrs: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'метраж подарка' },

  adapter: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: adapters, fullName: 'Блок' },
  plug: { type: DataTypes.STRING, defaultValue: 'Нет', fieldType: 'string', fullName: 'Вилка' },
  fitting: { type: DataTypes.STRING, defaultValue: 'Нет', fieldType: 'string', validateFields: fittings, fullName: 'Крепления' },
  dimmer: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Диммер' },
  giftPack: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Подарочная упаковка' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },

  // isMarketPlace: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean' },
  // status: { type: DataTypes.STRING, defaultValue: statuses[0], fieldType: 'string', validateFields: statuses },
  // installedAdapter: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', validateFields: adapters, fullName: 'Блок' },
};

const Order = sequelize.define('order', modelFields, { paranoid: true });

module.exports = {
  Order,
  modelFields,
};
