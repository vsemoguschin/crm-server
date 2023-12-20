const sequelize = require('../db')
const { DataTypes } = require('sequelize');
const stageList = [
    // { title: 'created' },
    { title: 'milled' },
    { title: 'laminated' },
    // { title: 'production' },
    { title: 'done' },
    { title: 'packed' },
    // { title: 'delivered' },
    // { title: 'paid' },
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


