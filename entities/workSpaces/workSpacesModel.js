const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const departments = ['COMMERCIAL', 'PRODUCTION'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true, fullName: 'Название' },
  department: { type: DataTypes.STRING, allowNull: false, validateFields: departments, fullName: 'Отдел' },
};

const WorkSpace = sequelize.define('workSpace', modelFields, {
  paranoid: true,
});

module.exports = {
  WorkSpace,
  modelFields,
};
