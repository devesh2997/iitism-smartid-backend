'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Userdump', {
        admn_no         :DataTypes.STRING,
        first_name     : DataTypes.STRING,
        middle_name      : {type:DataTypes.STRING, allowNull:true},
        last_name      : DataTypes.STRING,
        auth_id     : DataTypes.STRING,
        branch_id      : DataTypes.STRING,
        course_id      : DataTypes.STRING,
        email     : {type: DataTypes.STRING, allowNull: true, unique: false, validate: { isEmail: {msg: "Email invalid."} }},
        mobile_no     : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, isNumeric: { msg: "not a valid phone number."} }},
    }, {underscored: true});


    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
