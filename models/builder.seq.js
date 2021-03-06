"use strict";

var debug = require('debug')('tndr:models:builder');

module.exports = function(sequelize, DataTypes) {

	var builder = sequelize.define("builder", {
		id: {
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
	}, {
		paranoid: true,
		classMethods: classMethods,
	});

	debug('registered');
	return builder;
};

var classMethods = {
	associate: function(models) {
		models.builder.belongsTo(models.builder_category, {foreignKey : 'builder_category_id'});

		//models.builder.belongsToMany(models.person, {through: 'builder2person'});

		models.builder.belongsToMany(models.person, {as: 'employees', through: models.employee});
	},

};
