"use strict";

var promise  = require('bluebird');
//var fs       = require('fs');
//var fsp      = promise.promisifyAll(fs);
var _        = require('lodash');
var path     = require('path');
var walk     = require('walk');
var debug    = require('debug')('tndr:models:tender');

let tender = null;

exports = module.exports = function(sequelize, DataTypes) {

	const STATE_NEW_CODE = 'new';

	tender = sequelize.define("tender", {
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
		nameWrapper: {
			type: new DataTypes.VIRTUAL(DataTypes.STRING(1000)),
			get: function(){
				let name = this.getDataValue('name');
				if (name){ return name; }
				let id = this.getDataValue('id');
				return `<unnamed #${id}>`;
			}
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		simpro_quote_number: {
			type: DataTypes.STRING(1000),
		},

		state_code: {
			type: DataTypes.STRING(32),
			allowNull: false,
			defaultValue: STATE_NEW_CODE,
		},

		opening_date: {
			type: DataTypes.DATE,
		},
		closing_date: {
			type: DataTypes.DATE,
		},
	}, {
		paranoid: true,
		classMethods: classMethods,
		instanceMethods: instanceMethods,
	});

	tender.hook('beforeBulkCreate', function() {
		throw new Error('Unable to create tenders in bulk');
	});

	tender.tender_states = {};
	tender.tender_states[STATE_NEW_CODE] =
	{
		code: STATE_NEW_CODE,
		name: 'New',
	};

	debug('registered');
	return tender;
};

var classMethods = {
	associate: function(db) {
		db.tender.belongsTo(db.user, { as: 'created_by'});
		db.tender.belongsTo(db.user, { as: 'last_updated_by'});

		let estimator = db.tender.belongsTo(db.person, {as: 'estimator'});

		db.tender.reflist = [
			{ model: db.user, as: 'created_by', include: [db.person] },
			{ model: db.user, as: 'last_updated_by', include: [db.person] },
			estimator];
	},

}

var instanceMethods = {
	filesPath: function() {
		let cfg = tender.config.storage;
		return path.join(cfg.path, 'tender', this.id.toString());
	},

	filesList: function() {

		let rt = this.filesPath();
		let path_rem_count = rt.split(path.sep).length;

		return new promise(function(res, rej){
			let files = [];
			let w = walk.walk(rt);

			debug(`load files from [${rt}]`);

			w.on('file', function(root, stat, next){
				let parts = root.split(path.sep);
				parts.push(stat.name);

				files.push({
					uipath: parts.slice(path_rem_count),
					path: parts,
					name : stat.name,
					size: stat.size,
				});
				next();
			});

			w.on('end', function(){
				debug(`load files from [${rt}] DONE`);
				res(files);
			});

			w.on('errors', function(root, stats, next){
				if ('ENOENT' === _.get(stats, '[0].error.code')) {
					// there is no tender-files directory, return empty list:
					debug(`load files from [${rt}] DIR DOES NOT EXIST`);
					res([]);
				} else {
					debug('unhandled file ls error', root, stats);
					rej(new Error(stats));
				};
				next();
			});
		});
	},

}
