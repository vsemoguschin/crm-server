const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  fullName: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Имя пользователя' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, fieldType: 'string', fullName: 'Email' },
  password: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Пароль' },
  roleName: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Роль' },
  info: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Информация' },
  avatar: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Аватар' },
  department: {
    type: DataTypes.STRING,
    fieldType: 'string',
    fullName: '',
    // validate: { isIn: [DEPARTMENTS] }
  },
  status: { type: DataTypes.STRING, fieldType: 'string' },
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

module.exports = {
  User,
  modelFields,
};
