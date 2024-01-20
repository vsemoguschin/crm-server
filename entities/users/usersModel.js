const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'user',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    info: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING, allowNull: true },
    department: {
      type: DataTypes.STRING,
      // validate: { isIn: [DEPARTMENTS] }
    },
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
