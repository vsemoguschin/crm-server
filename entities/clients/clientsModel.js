const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const types = ['ООО', 'ИП', 'Физ', 'НКО'];
const genders = ['M', 'F', 'IT'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  fullName: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Имя клиента' },
  phone: { type: DataTypes.STRING, unique: true, allowNull: false, fieldType: 'number', fullName: 'Номер телефона' },
  chatLink: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Ссылка на чат' },
  adLink: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Ссылка на объявление' },
  gender: { type: DataTypes.STRING, allowNull: false, validateFields: genders, fieldType: 'string', fullName: 'Пол' },
  city: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Город' },
  region: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Регион' },
  type: { type: DataTypes.STRING, allowNull: false, validateFields: types, fieldType: 'string', fullName: 'Тип клиента' },
  sphere: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Сфера деятельности' },
  info: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Информация' },
  inn: { type: DataTypes.STRING, defaultValue: '', fieldType: 'number', fullName: 'ИНН' },
  firstContact: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дата первого контакта' },
};

const Client = sequelize.define('client', modelFields, {
  paranoid: true,
});

module.exports = {
  Client,
  modelFields,
};
