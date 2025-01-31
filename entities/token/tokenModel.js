const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const TokenSchema = sequelize.define('token', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = TokenSchema;
