const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const stageList = [
  { id: 1, title: 'milling', fullName: 'Фрезеровка' },
  { id: 2, title: 'laminating', fullName: 'Пленка' },
  { id: 3, title: 'master', fullName: 'Сборка' },
  { id: 4, title: 'packed', fullName: 'Упаковка' },
  { id: 5, title: 'done', fullName: 'Готов' }, //отправка
  // { title: 'my', fullName: 'Мои заказы' },
  // { title: 'defective', fullName: 'Брак' },
];

const orderPreview = [
  // {include:}
];

const availableStages = {
  ['ADMIN']: stageList,
  ['G']: stageList,
  ['FRZ']: [stageList[0]],
  ['LAM']: [stageList[1], stageList[0]],
  ['MASTER']: [stageList[2]],
  ['PACKER']: [stageList[3], stageList[4]],
};

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
  availableStages,
};
