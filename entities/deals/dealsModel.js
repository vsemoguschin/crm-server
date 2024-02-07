const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const statuses = ['created', 'process', 'done'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Название сделки' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Стоимость без допов' }, // стоимость вывески без допа, но выводить еще вместе с допами общую
  // firstContact: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дата первого контакта' },
  clothingMethod: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Метод закрытия' },
  // source: { type: DataTypes.STRING, allowNull: false },
  // chatLink: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Ссылка на рекламу' },
  status: { type: DataTypes.STRING, fieldType: 'string', validateFields: statuses, fullName: 'Статус' },
  deadline: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Дедлайн' },
  description: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Описание' },
};

//status заменить на isDone

const Deal = sequelize.define('deal', modelFields, {
  paranoid: true,
});

console.log(true == 'true');

module.exports = {
  Deal,
  modelFields,
};
