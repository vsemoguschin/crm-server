const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const rolesList = [
  {
    shortName: 'ADMIN',
    fullName: 'Admin',
    department: 'ALL',
  },
  {
    shortName: 'G',
    fullName: 'Владелец системы',
    department: 'ALL',
  },
  //КОММЕРЧЕСКИЙ ОТДЕЛ
  {
    shortName: 'KD',
    fullName: 'Коммерческий директор',
    department: 'COMERCIAL',
  },
  //менеджеры
  {
    shortName: 'DO',
    fullName: 'Директор отдела продаж',
    department: 'COMERCIAL'
  },
  {
    shortName: 'ROP',
    fullName: 'Руководитель отдела продаж',
    department: 'COMERCIAL'
  },
  {
    shortName: 'MOP',
    fullName: 'Менеджер отдела продаж',
    department: 'COMERCIAL'
  },
  //ведение(лтв)
  {
    shortName: 'ROV',
    fullName: 'Руководитель отдела ведения',
    department: 'COMERCIAL'
  },
  {
    shortName: 'MOV',
    fullName: 'Менеджер отдела ведения',
    department: 'COMERCIAL'
  },
  //дизайнеры
  {
    shortName: 'ROD',
    fullName: 'Руководитель отдела дизайна',
    department: 'DESIGN'
  },
  {
    shortName: 'DIZ',
    fullName: 'Дизайнер',
    department: 'DESIGN'
  },
  //ПРОИЗВОДСТВО
  {
    shortName: 'DP',
    fullName: 'Директор производств',
    department: 'PRODUCTION'
  },
  {
    shortName: 'RP',
    fullName: 'Руководитель филиала',
    department: 'PRODUCTION'
  },
  {
    shortName: 'FRZ',
    fullName: "Фрезеровщик",
    department: 'PRODUCTION'
  },
  {
    shortName: 'LAM',
    fullName: "Монтажник пленки",
    department: 'PRODUCTION'
  },
  {
    shortName: 'MASTER',
    fullName: "Сборщик",
    department: 'PRODUCTION'
  },
  {
    shortName: 'PACKER',
    fullName: "Упаковщик",
    department: 'PRODUCTION'
  },
  // ['']: "Отправщик",
];
const list = ['Admin'];
console.log(!!rolesList.find(el => el.shortName == 'MOP'));
const DEPARTMENTS = ['COMERCIAL', 'DESIGN', 'PRODUCTION'];

const Role = sequelize.define(
  'role',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shortName: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
  },
  {
    paranoid: true,
  },
);

module.exports = {
  Role,
  rolesList
};
