"use strict";

var debug = require('debug')('tndr:models:builder_category');
var _     = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var builder_category = sequelize.define("builder_category", {
			builder_category: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			code: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true
			},
			tip_usage: DataTypes.TEXT,
			tip_price: DataTypes.TEXT,
			note: DataTypes.TEXT,
			sort: DataTypes.INTEGER,
		},
		{
			classMethods: classMethods,
		}
	);

	return builder_category;
};

var classMethods = {
	associate: function(models) {
		models.builder_category.hasMany(models.builder);
	},

	initialFill: function(models) {
		let bc = models.builder_category;
		return bc.create({
				code: 'priority',
				name: 'Priority Builders',
				tip_usage: 'Price Every Available Opportunity',
				tip_price: 'Price Meticulously',
				note: 'Reconsider if circumstances will affect our probability of success.',
				sort: 10,
		}).then(
			bc.create({
				code: 'decent',
				name: 'Decent Builders',
				tip_usage: 'Price Majority of Opportunities',
				tip_price: 'Price Meticulously',
				note: 'Reconsider if circumstances will affect our probability of success.',
				sort: 20,
			})
		).then(
			bc.create({
				code: 'considerable',
				name: 'Considerable Builders',
				tip_usage: 'Price If We Have Time',
				tip_price: 'Price With Some Attention',
				note: 'If we are at the least bit too busy or have other commitments, we need to decline',
				sort: 30,
			})
		).then(
			bc.create({
				code: 'tentative',
				name: 'Tentative Builders',
				tip_usage: 'Price Only If Other Builders On It',
				tip_price: 'Price With Additional Margins',
				note: 'We will not consider these Builders unless we have a true opportunity or others are on it.',
				sort: 40,
			})
		).then(
			bc.create({
				code: 'unfavourable',
				name: 'Unfavourable Builders',
				tip_usage: 'Price Only If Other Builders On It',
				tip_price: 'Price With Additional Margins',
				note: 'Do not need to offer them the same attention as others ie; Tender Breakdowns, etc.',
				sort: 50,
			})
		);
	},
};
