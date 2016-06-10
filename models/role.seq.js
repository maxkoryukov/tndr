"use strict";

var debug   = require('debug')('tndr:models:role');
var _       = require('lodash');
var promise = require('bluebird');

let _roles = [               'root',   'manager'       ];
let _persmissions = {
	'app.users.list':   [    true,     false,          ],
	'app.users.state':  [    true,     false,          ],
	'app.users.new':    [    true,     false,          ],
};

let permissions = {};

debug('Remapping permissions');
_(_roles)
	.forEach((role, role_index) => {
		_.forOwn(_persmissions, function(matrix, perm){
			//debug(role, role, role_index, perm, matrix[role_index]);
			if (matrix[role_index]){
				if (!permissions[role]){
					permissions[role] = {};
				}
				permissions[role][perm] = matrix[role_index];
			};
		});
	});
debug('Remapping permissions DONE');

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
			},
			note: {
				type: DataTypes.STRING(4096),
				allowNull: true,
			},

			permissions: {
				type: DataTypes.VIRTUAL,
				get: function() {
					return permissions[this.getDataValue('code')] || {};
				}
			}
		},
		{
			paranoid: true,
			classMethods: classMethods,
			instanceMethods : instanceMethods,
		}
	);

	debug('registered');
	return role;
};

let classMethods = {
	associate: function(models) {
		models.role.belongsToMany(models.user, { as: 'users', through: 'role2user'});
		// AND back reference
		// for USER table:
		models.user.belongsToMany(models.role, { as: 'roles', through: 'role2user'});
	},

	initialFill: function(models) {
		let roles = [
			{
				code: 'root',
				name: 'SuperAdministrator',
				note: 'The main administrator of the application. All operations are allowed'
			},

			{
				code: 'manager',
				name: 'Manager',
				note: 'Manager, common user of TNDR without administrtive priveleges',
			}
		];

		return promise.map(roles, newrole => models.role.create(newrole));
	},

	isInRole: function role__isInRole(username, rolecode){

		debug('isInRole');

		if (! _.isString(username) ||  !_.isString(rolecode)){
			throw new Error('Invalid argument');
		}

		debug(`isInRole ( [${username}], [${rolecode}] )`);

		let s = this.sequelize;

		return s.models.role.count({
				where: { code: rolecode },
				include:[{
					model: s.models.user,
					through: 'role2user',
					as: 'users',
					where: { username : username }
				}]
			}).then(function(counter){

				return counter > 0;
			})
		;
	},

	getRoles: function role__getRoles(username){
		debug('getRoles');

		if (! _.isString(username)) {
			throw new Error('Invalid argument');
		}

		debug(`getRoles ([${username}])`);

		let s = this.sequelize;

		return s.models.role.findAll({
				include:[{
					model: s.models.user,
					through: 'role2user',
					as: 'users',
					where: { username : username }
				}]
			}).then(function(roles){

				return roles;
			})
		;
	},
}

let instanceMethods = {
}
