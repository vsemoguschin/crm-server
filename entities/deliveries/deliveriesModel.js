const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const methods = ['СДЕК', 'ПОЧТА', 'Курьер', 'Балтийский курьер', 'Самовывоз'];
const types = ['Платно', 'Бесплатно']; 

const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  method: { type: DataTypes.STRING, allowNull: false, fieldType: 'string',validateFields: methods, fullName: 'Способ доставки' },
  type: { type: DataTypes.STRING, fieldType: 'string',validateFields: types, fullName: 'Платно/Бесплатно' },
  description: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Данные/Описание' },
  city: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Город получения' },
  //ниже поля заполняются на производстве, не выводить при созданиии
  price: { type: DataTypes.INTEGER, fieldType: 'number', fullName: 'Стоимость доставки' },
  track: { type: DataTypes.INTEGER, fieldType: 'number', fullName: 'Трек-номер' },
  sent: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Отправлено' },
  //поле после отправки доступно для редактирования
  received: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Доставлен' },
};

const Delivery = sequelize.define('delivery', modelFields, {
  paranoid: true,
});

module.exports = {
  Delivery,
  modelFields
};