const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const stageList = [
  { title: 'milling', fullName: 'Фрезеровка' },
  { title: 'laminating', fullName: 'Пленка' },
  { title: 'master', fullName: 'Сборка' },
  { title: 'packed', fullName: 'Упаковка' },
  { title: 'done', fullName: 'Готов' },
  // { title: 'my', fullName: 'Мои заказы' },
  // { title: 'defective', fullName: 'Брак' },
];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true, fieldType: 'string', fullName: 'Наименование' },
  fullName: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Расшифровка' },
};

const Stage = sequelize.define('stage', modelFields, {
  paranoid: true,
});

module.exports = {
  Stage,
  stageList,
  modelFields,
};
