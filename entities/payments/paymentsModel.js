const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const methods = ['Наличные', 'Перевод', 'Договор', 'Наложка', 'Оплата по ссылке', 'Долями', 'Рассрочка', 'По счету'];//таблица

const modelFields = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Назначение платежа' }, //title
    price: { type: DataTypes.INTEGER, allowNull: false, fieldType: 'number', fullName: 'Сумма' },
    date: { type: DataTypes.STRING, allowNull: false, fieldType: 'string', fullName: 'Дата отплаты' },
    method: { type: DataTypes.STRING, allowNull: false, validateFields: methods, fieldType: 'string', fullName: 'Способ оплаты' },
    description: { type: DataTypes.STRING, fieldType: 'string', fullName: 'Описание' },
};

//добавить отправку по готовности
const Payment = sequelize.define('payment', modelFields, {
    paranoid: true,
});

module.exports = {
    Payment,
    modelFields
};

