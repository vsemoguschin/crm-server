const sequelize = require('../db')
const { DataTypes } = require('sequelize');

const workSpacesList = [
    { name: 'KRD', fullName: 'Краснодар', department: 'PRODUCTION'},
    { name: 'MSK', fullName: 'Москва', department: 'PRODUCTION'},
    { name: 'SPB', fullName: 'Санкт-петербург', department: 'PRODUCTION'},
    { name: 'VK', fullName: 'ВКонтакте', department: 'COMERCIAL'},
    { name: 'AVITO', fullName: 'Авито', department: 'COMERCIAL'},
];

const departments = ['COMERCIAL', 'PRODUCTION'];

const modelFields = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true, fullName:'Сокращение' },
    fullName: { type: DataTypes.STRING, allowNull: false, fullName:'Название' },
    department: { type: DataTypes.STRING, allowNull: false, validateFields: departments, fullName:'Отдел' },
    // creator: { type: DataTypes.STRING, allowNull: false },
};

const WorkSpace = sequelize.define('workSpace', modelFields, {
    paranoid: true,
});

module.exports = {
    WorkSpace,
    modelFields,
    workSpacesList
};