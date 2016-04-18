"use strict";

var debug = require('debug')('tndr:models:employee');

module.exports = function(sequelize, DataTypes) {

	var employee = sequelize.define("employee", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			job: {
				type: DataTypes.STRING(500),
				allowNull: false
			},
		},

		/* employee OPTIONS */
		{
			paranoid: false,
			classMethods: classMethods,
			//instanceMethods : instanceMethods,
		}
	);

	debug('registered');
	return employee;
};

var classMethods = {
	//associate: function(models) {
	//},
};
