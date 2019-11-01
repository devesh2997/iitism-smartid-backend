'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        admn_no         :{type:DataTypes.STRING, allowNull:false, unique:true},
        first_name     : DataTypes.STRING,
        middle_name      : {type:DataTypes.STRING, allowNull:true},
        last_name      : DataTypes.STRING,
        auth_id     : DataTypes.STRING,
        branch_id      : DataTypes.STRING,
        course_id      : DataTypes.STRING,
        email     : {type: DataTypes.STRING, allowNull: true, unique: false, validate: { isEmail: {msg: "Email invalid."} }},
        mobile_no     : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, isNumeric: { msg: "not a valid phone number."} }},
        smartid_no      :{type:DataTypes.STRING, allowNull:false},
        balance        : DataTypes.DOUBLE,
        password  : DataTypes.STRING,
    }, {underscored: true});

    Model.associate = function(models){
        this.hasMany(models.Transaction, {as: 'Transactions'})
    }


    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if(err) TE(err.message, true);

            user.password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if(!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if(err) TE(err);

        if(!pass) TE('invalid password');

        return this;
    }

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
