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
				validate: {
					len: {
						args: [2, 100],
						msg: "The length should be at least 2, and at most 100 chars",
					}
				},
				allowNull: false,
			},
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
				},

				setState: function setState(uid, enabled){
					debug('setState', uid, enabled);

					return this
						.findById(uid, { paranoid: false, raw: false} )
						.then(function(u){
							if (u.username === 'root'){
								throw new Error('Vorbidden');
							}
							return u;
						})
						.then(function(u){
							if (enabled){
								return u.restore({ paranoid: false});
							} else {
								return u.destroy();
							}
						});
				},
			}
		}
	);

	return user;
};
