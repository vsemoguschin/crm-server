const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const statuses = ['created', 'process', 'done'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название сделки' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Стоимость без допов' }, // стоимость вывески без допа, но выводить еще вместе с допами общую
  status: { type: DataTypes.STRING, defaultValue: 'created', fieldType: 'string', validateFields: statuses, fullName: 'Статус' },
  deadline: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дедлайн' },
  clothingMethod: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Метод закрытия' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },
  source: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Источник сделки' },
};

//status заменить на isDone

const Deal = sequelize.define('deal', modelFields, {
  paranoid: true,
});

const DealUsers = sequelize.define('dealUsers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  part: { type: DataTypes.FLOAT, defaultValue: 1, fieldType: 'number', fullName: 'Доля сделки' },
});

//источники сделок
const DealSources = sequelize.define('dealSources', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Источник сделки' },
});

//общая таблица методов закрытия
const ClothingMethods = sequelize.define('clothingMethod', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, fieldType: 'string', fullName: 'Метод закрытия' },
});

module.exports = {
  Deal,
  modelFields,
  DealUsers,
  DealSources,
  ClothingMethods,
};
