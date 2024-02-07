const sequelize = require('../db');
const { DataTypes } = require('sequelize');

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
};
