const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const types = ['previews', 'drafts', 'documents', 'photos'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  ya_name: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  preview: { type: 'VARCHAR(1000)' },
  url: { type: 'VARCHAR(1000)', allowNull: false },
  type: { type: DataTypes.STRING, valdateFields: types ,allowNull: false },
};

const File = sequelize.define('file', modelFields);

module.exports = {
  File,
  modelFields
};
