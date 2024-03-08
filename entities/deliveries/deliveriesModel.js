const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const methods = ['СДЕК', 'ПОЧТА', 'Курьер', 'Балтийский курьер', 'Самовывоз'];
const types = ['Платно', 'Бесплатно', 'Досыл'];
const statuses = ['Создана', 'Доступна', 'Отправлена'];

//фиксировать досылы, сделать галочку
const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  method: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: methods, fullName: 'Способ доставки' },
  type: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', validateFields: types, fullName: 'Платно/Бесплатно' },
  description: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Данные/Описание' },
  city: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Город получения' },
  // region: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Регион' },
  //ниже поля заполняются на производстве, не выводить при созданиии
  price: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Стоимость доставки' },
  track: { type: DataTypes.STRING, defaultValue: 0, fieldType: 'number', fullName: 'Трек-номер' },
  // readyToSend: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Отправить по готовности' },
  status: { type: DataTypes.STRING, defaultValue: statuses[0], validateFields: statuses, fieldType: 'string' },
};

const Delivery = sequelize.define('delivery', modelFields, {
  paranoid: true,
});

module.exports = {
  Delivery,
  modelFields,
};
