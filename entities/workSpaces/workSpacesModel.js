const sequelize = require('../db')
const { DataTypes } = require('sequelize');

const workSpacesList = [
    { name: 'KRD', fullName: 'Краснодар', department: 'PRODUCTION'},
    { name: 'MSK', fullName: 'Москва', department: 'PRODUCTION'},
    { name: 'SPB', fullName: 'Санкт-петербург', department: 'PRODUCTION'},
];

const WorkSpace = sequelize.define('workSpace', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, //title
    fullName: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    // creator: { type: DataTypes.STRING, allowNull: false },
}, {
    paranoid: true,
});

module.exports = {
    WorkSpace,
    workSpacesList
};