const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const DEPARTMENTS = ['COMERCIAL', 'PRODUCTION'];

const User = sequelize.define(
  'user',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    info: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true },
    owner: { type: DataTypes.JSON, allowNull: false },
    department: {
      type: DataTypes.STRING,
      // validate: { isIn: [DEPARTMENTS] }
    },
    ownersList: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.STRING },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    scopes: {
      fullScope: {},
    },
    paranoid: true,
  },
);

module.exports = User;
