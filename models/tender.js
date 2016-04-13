"use strict";

var debug = require('debug')('tndr:models:tender');

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
				allowNull: false
			},
			simpro_quote_number: {
				type: DataTypes.STRING(1000),
			},

			opening_date: {
				type: DataTypes.DATE,
			},
			closing_date: {
				type: DataTypes.DATE,
			},
		},
		{
			paranoid: true,
			classMethods: classMethods,
		}
	);

	tender.hook('beforeBulkCreate', function(records, fields) {
		throw new Error('Unable to create tenders in bulk');
	});

	debug('registered');
	return tender;
};

var classMethods = {
	associate: function(models) {
		let creator = models.tender.belongsTo(models.user, { as: 'created_by'});
		models.tender.reflist = [creator];
	},

};
