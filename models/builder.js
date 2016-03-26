"use strict";

var debug = require('debug')('tndr:models:builder');
var _     = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var builder = sequelize.define("builder", {
			builder: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true
			},
		},
		{
			paranoid: true,
			classMethods: classMethods,
		}
	);

	return builder;
};

var classMethods = {
	associate: function(models) {
		models.builder.belongsTo(models.builder_category);

		models.builder.belongsToMany(models.person, {through: 'builder2person'});
	},

};
