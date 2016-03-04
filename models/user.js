"use strict";

var debug = require('debug')('tndr:model.user');
var _     = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var user = sequelize.define("user", {
			user: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true },
			username: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true },
			password: {
				type: DataTypes.STRING(100),
				collate: 'BINARY',
				allowNull: false },
		},
		{
			paranoid: true,
			classMethods: {
				associate: function(models) {
					//User.hasMany(models.Task)
				},

				authenticate: function authenticate(username, password){
					debug('authenticate', username);

					let hash = password;

					return this.findAndCountAll({
							where: {
								username: username,
								password: hash
							},
							limit: 2,
						}).then(function(result){
							if (result.count !== 1){
								return null;
							} else {
								return result.rows[0].user;
							}
						});
				},

				changePassword: function changePassword(username, password, newhash){
					debug('changePassword', username);

					return this.authenticate(username, password)
						.then(function(id){
							return user.update(
									{ password : newhash },
									{ where : { user : { $eq : id } } }
								);
						})
						.get(0)
						.then(Boolean);
				}
			}
		}
	);

	return user;
};
