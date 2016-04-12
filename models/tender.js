"use strict";

var debug = require('debug')('tndr:models:tender');
var _     = require('lodash');

exports = module.exports = function(sequelize, DataTypes) {

	var tender = sequelize.define("tender", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(1000),
				allowNull: false,
				unique: true
			},
			simproQuoteNumber: {
				type: DataTypes.STRING(1000),
			},

			openingDate: {
				type: DataTypes.DATE,
			},
			closingDate: {
				type: DataTypes.DATE,
			},
		},
		{
			paranoid: true,
			classMethods: classMethods,
		}
	);

	return tender;
};

var classMethods = {
	associate: function(models) {
		//models.tender.belongsTo(models.builder_category, {foreignKey : 'builder_category_id'});
	},

};
