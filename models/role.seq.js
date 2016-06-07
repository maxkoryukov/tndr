"use strict";

var debug   = require('debug')('tndr:models:role');
var _       = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var role = sequelize.define("role", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			// this is the most important field - it will (and must) be used for permissions checks
			code: {
				type: DataTypes.STRING(256),
				allowNull: false,
				unique: true,
			},
			name: {
				type: DataTypes.STRING(256),
				allowNull: false,
				unique: true,
			},
			note: {
				type: DataTypes.STRING(4096),
				allowNull: true,
			},
		},
		{
			paranoid: true,
			classMethods: classMethods,
			//instanceMethods : instanceMethods,
		}
	);

	debug('registered');
	return role;
};

var classMethods = {
	associate: function(models) {
		models.role.belongsToMany(models.user, { as: 'users', through: 'role2user'});
		// AND back reference
		// for USER table:
		models.user.belongsToMany(models.role, { as: 'roles', through: 'role2user'});
	},

	isInRole: function role__isInRole(username, rolecode){

		debug('isInRole');

		if (! _.isString(username) ||  !_.isString(rolecode)){
			throw new Error('Invalid argument');
		}

		debug(`isInRole ( ${username} , ${rolecode}`);

		let s = this.sequelize();

		return s.models.role.findOne({
				where: { code: rolecode },
				include:[{
					model: s.models.user,
					through: 'role2user',
					as: 'users',
					where: { username : username }
				}]
			}).then(function(role){
debug('RESULT:', role);
				return !!role;
			})
		;
	},
}
