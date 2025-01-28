const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const stageList = [
  { title: 'Выгрузка' },
  { title: 'Компоновка' },
  { title: 'Фрезеровка' },
  { title: 'Пленка' },
  { title: 'Сборка' },
  { title: 'В работе' },
  { title: 'ОКК' },
  { title: 'ОКК(Оплачено)' },
  { title: 'Упаковано' },
  { title: 'Оплачено' },
  { title: 'Отправлен' },
  { title: 'На исправлении' },
  { title: 'Ремонт' },
  { title: 'Возврат' },
  { title: 'Брак' },
];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true, fieldType: 'string', fullName: 'Наименование' },
  index: { type: DataTypes.INTEGER, fieldType: 'number', fullName: 'Порядковый номер' },
};

const Stage = sequelize.define('stage', modelFields, {
  paranoid: true,
});

module.exports = {
  Stage,
  stageList,
  modelFields,
};
