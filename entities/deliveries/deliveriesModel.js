const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const methods = ['СДЕК', 'ПОЧТА РОССИИ', 'Яндекс', 'Балтийский курьер', 'Самовывоз', 'ТК КИТ', 'ПЭТ', 'Боксбери', 'Деловые линии'];
const types = ['Платно', 'Бесплатно', 'Досыл'];
const statuses = ['Создана', 'Доступна', 'Отправлена', 'Вручена', 'Возврат'];

//фиксировать досылы, сделать галочку
const modelFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  method: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', validateFields: methods, fullName: 'Способ доставки' },
  type: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', validateFields: types, fullName: 'Платно/Бесплатно' },
  description: { type: 'VARCHAR(1000)', allowNull: false, fieldType: 'string', fullName: 'Данные/Описание' },
  track: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Трек-номер' },
  status: { type: DataTypes.STRING, defaultValue: statuses[0], validateFields: statuses, fieldType: 'string' },
  // city: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Город получения' },
  // region: { type: DataTypes.STRING, defaultValue: '', fieldType: 'string', fullName: 'Регион' },
  //ниже поля заполняются на производстве, не выводить при созданиии
  price: { type: DataTypes.INTEGER, defaultValue: 0, fieldType: 'number', fullName: 'Стоимость доставки' },
  // readyToSend: { type: DataTypes.BOOLEAN, defaultValue: false, fieldType: 'boolean', fullName: 'Отправить по готовности' },
};

const Delivery = sequelize.define('delivery', modelFields, {
  paranoid: true,
});

module.exports = {
  Delivery,
  modelFields,
};
