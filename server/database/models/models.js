const sequelize = require('../database');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type:DataTypes.INTEGER(8), primaryKey:true, autoIncrement:true},
    name: {type:DataTypes.STRING(40)},
    surname: {type:DataTypes.STRING(40)},
    email: {type:DataTypes.STRING, unique:true},
    type: {type:DataTypes.STRING(8), defaultValue:'USER'},
    login: {type:DataTypes.STRING, unique:true},
    password: {type:DataTypes.STRING},
})

module.exports = {
    User,
}