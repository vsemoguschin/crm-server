const sequelize = require('../db')
const { DataTypes } = require('sequelize');

const workSpacesList = [
    { title: 'KRD', fullName: 'Краснодар', department: 'PRODUCTION', creator: 1},
    { title: 'MSK', fullName: 'Москва', department: 'PRODUCTION', creator: 1},
    { title: 'SPB', fullName: 'Санкт-петербург', department: 'PRODUCTION', creator: 1},
    { title: 'VK', fullName: 'ВКонтакте', department: 'COMERCIAL', creator: 1},
    { title: 'AVITO', fullName: 'Авито', department: 'COMERCIAL', creator: 1},
];

const departments = ['COMERCIAL', 'PRODUCTION'];

const modelFields = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true, fullName:'Сокращение' },//? надо ли?
    fullName: { type: DataTypes.STRING, allowNull: false, fullName:'Название' },
    department: { type: DataTypes.STRING, allowNull: false, validateFields: departments, fullName:'Отдел' },
};

const WorkSpace = sequelize.define('workSpace', modelFields, {
    paranoid: true,
});

module.exports = {
    WorkSpace,
    modelFields,
    workSpacesList
};