const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  card_id: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'ID карточки' },
  card_link: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Ссылка на карточку дизайна' },
  description: { type: 'VARCHAR(10000)', allowNull: false, fieldType: 'string', fullName: 'Описание' },
  preview: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Ссылка на превью' },
  maket: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Ссылка на файл' },
  status: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Статус выгрузки' },
};

//добавить отправку по готовности
const Preorder = sequelize.define('preorder', modelFields, {
  paranoid: true,
});

module.exports = {
  Preorder,
  modelFields,
};
