const sequelize = require('../db')
const { DataTypes } = require('sequelize');
const stageList = [
    { title: 'created' },
    { title: 'milled' },
    { title: 'laminated' },
    { title: 'producted' },
    { title: 'packed' },
    { title: 'delivered' },
    // { title: 'paid' },
    { title: 'defective' }, //брак
];

const Stage = sequelize.define('stage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    
    description: { type: DataTypes.STRING },
});

module.exports = {
    Stage,
    stageList
};


