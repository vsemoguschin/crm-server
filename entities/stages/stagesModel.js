const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const stageList = [
  // { title: 'created' },
  { title: 'Фрезеровка', job: 'milling' }, // Фрезеровка
  { title: 'Упаковка', job: 'package' }, // Упаковка
  { title: 'Пленка', job: 'millwright' }, // Пленка
  { title: 'Сборка', job: 'fitter' }, // Сборка
  { title: 'Готова к отправке', job: 'ready' }, // Готова к отправке
  { title: 'Доставка', job: 'delivery' }, // Доставка
  { title: 'Выполнен', job: 'done' }, // Доставка
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
  job: { type: DataTypes.STRING },
});

module.exports = {
  Stage,
  stageList,
};
