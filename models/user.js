"use strict";

var debug = require('debug')('tndr:models:user');
var _     = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var user = sequelize.define("user", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: DataTypes.STRING(256),
				allowNull: false,
				unique: true,
				validate: {
					len: {
						args: [1, 256],
						msg: "The length of username should be at least 1, and at most 100 chars",
					}
				},
			},
			password: {
				type: DataTypes.STRING(256),
				collate: 'BINARY',
				validate: {
					len: {
						args: [2, 250],
						msg: "The length of password should be at least 2, and at most 100 chars",
					}
				},
				allowNull: false,
			},
		},
		{
			paranoid: true,
			classMethods: classMethods,
			instanceMethods : instanceMethods,
		}
	);

	return user;
};

var classMethods = {
	associate: function(models) {
		models.user.belongsTo(models.person);
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
					let err = new Error('Forbidden');
					err.status = 403;
					throw err;
				} else {
					let id = result.rows[0].id;
					return id;
				}
			});
	},

	changePassword: function changePassword(username, password, newhash){
		debug('changePassword', username);

		return this.authenticate(username, password)
			.bind(this)
			.then(function(id){
				return this.update(
						{ password : newhash },
						{ where : { id : { $eq : id } } }
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
					throw new Error('Forbidden');
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

};

var instanceMethods = {
	allowed: function allowed(perm){
		return true;
	},
};
