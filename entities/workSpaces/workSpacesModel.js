const sequelize = require('../db')
const { DataTypes } = require('sequelize');

const workSpacesList = [
    { name: 'ALL' },
    { name: 'KRD', },
    { name: 'MSK', },
    { name: 'SPB' },
];

const WorkSpace = sequelize.define('workSpace', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = {
    WorkSpace,
    workSpacesList
};