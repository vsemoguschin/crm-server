const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const methods = ['Наличные', 'Перевод', 'Договор', 'Наложка', 'Ссылка', 'Долями', 'Рассрочка', 'Счет', 'Бронь'];

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Назначение платежа' },
  price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Сумма' },
  date: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дата отплаты' },
  method: { type: DataTypes.STRING, allowNull: false, validateFields: methods, fieldType: 'string', fullName: 'Способ оплаты' },
  description: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Описание' },
  reservation: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Бронь' },
  period: { type: DataTypes.STRING, defaultValue: new Date().toISOString().slice(0, 7), fieldType: 'string', fullName: 'Период' },
};

//добавить отправку по готовности
const Payment = sequelize.define('payment', modelFields, {
  paranoid: true,
});

module.exports = {
  Payment,
  modelFields,
};
