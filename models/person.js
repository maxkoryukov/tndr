"use strict";

var debug = require('debug')('tndr:model.person');
var _     = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var person = sequelize.define("person", {
			person: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false
			},
			surname: {
				type: DataTypes.STRING(500),
				allowNull: true
			},
			phone: {
				type: DataTypes.STRING(500),
				//allowNull: false
			},
			note: {
				type: DataTypes.TEXT,
				allowNull: true
			},
		},
		/* person OPTIONS */
		{
			paranoid: true,
			classMethods: classMethods
		}
	);

	return person;
};

var classMethods = {
	associate: function(models) {
		models.person.hasOne(models.user);

		models.person.belongsToMany(models.builder, {through: 'builder2person'});
	},
};
