const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, fieldType: 'number' },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Название' },
};

const Group = sequelize.define('group', modelFields);

module.exports = { Group, modelFields };
