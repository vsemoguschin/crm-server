const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const types = ['ООО', 'ИП', 'Физ', 'НКО']; //marketplace?
const genders = ['M', 'F', 'IT'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  fullName: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Имя клиента' },
  phone: { type: DataTypes.STRING, allowNull: false, fieldType: 'number', fullName: 'Номер телефона' },
  chatLink: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Ссылка на чат' },
  gender: { type: DataTypes.STRING, allowNull: false, validateFields: genders, fieldType: 'string', fullName: 'Пол' },
  city: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Город' },
  region: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Регион' },
  type: { type: DataTypes.STRING, allowNull: false, validateFields: types, fieldType: 'string', fullName: 'Тип клиента' },
  sphere: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Сфера деятельности' },
  info: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Информация' },
};

const Client = sequelize.define('client', modelFields, {
  paranoid: true,
});

module.exports = {
  Client,
  modelFields,
};
