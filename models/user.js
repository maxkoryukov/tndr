"use strict";

var debug = require('debug')('tndr:model.user');

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
			"paranoid": true,
			classMethods: {
				associate: function(models) {
					//User.hasMany(models.Task)
				},

				authenticate: function authenticate(username, password, done){
					debug('user.authenticate', username, password);

					this.findAndCountAll({
						where: {
							username: username,
							password: password
						},
						limit: 2,
					}).then(function(result){
						if (result.count !== 1){
							done(null);
						} else {
							done(result.rows[0].user);
						}
					});
				},

			}
		}
	);

	return user;
};
