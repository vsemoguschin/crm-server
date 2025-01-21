const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const statuses = ['online', 'ofline'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  fullName: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Имя пользователя' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, fieldType: 'string', fullName: 'Email' },
  password: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Пароль' },
  info: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Информация' },
  tg: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Ссылка на телеграм' },
  tg_id: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'телеграм id' },
  status: { type: DataTypes.STRING, defaultValue: '', validateFields: statuses, fieldType: 'string' },
};

const User = sequelize.define('user', modelFields, {
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
  scopes: {
    fullScope: {},
  },
  paranoid: true,
});

module.exports = { User, modelFields };
