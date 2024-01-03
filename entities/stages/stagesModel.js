const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const stageList = [
  // { title: 'created' },
  { title: 'Фрезеровка', description: 'milling' }, // Фрезеровка
  { title: 'Упаковка', description: 'package' }, // Упаковка
  { title: 'Пленка', description: 'millwright' }, // Пленка
  { title: 'Сборка', description: 'fitter' }, // Сборка
  { title: 'Готова к отправке', description: 'ready' }, // Готова к отправке
  { title: 'Доставка', description: 'delivery' }, // Доставка
  // { title: 'paid' },
];

// const stageList = [
//   // { title: 'created' },
//   { title: 'milling' }, // Фрезеровка
//   { title: 'packager' }, // Упаковка
//   { title: 'millwright' }, // Пленка
//   { title: 'fitter' }, // Сборка
//   { title: 'ready' }, // Готова к отправке
//   { title: 'delivery' }, // Доставка
//   { title: 'received' }, // Доставлено
//   // { title: 'paid' },
//   { title: 'defective' }, //брак
// ];

const Stage = sequelize.define('stage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
});

module.exports = {
  Stage,
  stageList,
};
