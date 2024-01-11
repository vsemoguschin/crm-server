const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Group = sequelize.define('group', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true }, 
    description: { type: DataTypes.STRING, },
    department: { type: DataTypes.STRING, allowNull: false},
    creator: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Group;

