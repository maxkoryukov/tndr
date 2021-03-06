"use strict";

var debug = require('debug')('tndr:models:person');

module.exports = function(sequelize, DataTypes) {

	var person = sequelize.define("person", {
		id: {
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
	}, {
		/* person OPTIONS */
		paranoid: true,
		classMethods: classMethods,
		instanceMethods : instanceMethods,
	});

	debug('registered');
	return person;
};

var classMethods = {
	associate: function(models) {
		models.person.hasOne(models.user);

		//models.person.belongsToMany(models.builder, {through: 'builder2person'});


		models.person.belongsToMany(models.builder, {as: 'employers', through: models.employee});
	},
};

var instanceMethods = {
	getPhoneLink : function phoneLink() {
		let p = this.phone;
		if (!p) {
			return null;
		}
		p = p.replace(/\D/g, '');
		if (!p){
			return null;
		}
		p = 'tel:+' + p;
		return p;
	}
};