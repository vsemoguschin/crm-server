const sequelize = require('../db')
const { DataTypes } = require('sequelize');

const marketplaces = ['wb', 'ozon'];
const types = ['ООО', 'ИП', 'Физ', 'НКО'];
const genders = ['M', 'F']

const Client = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    chatLink: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    sphere: { type: DataTypes.STRING },
    info: { type: DataTypes.STRING },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Client, marketplaces;