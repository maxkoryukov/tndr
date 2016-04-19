"use strict";

var promise  = require('bluebird');
// var fs       = require('fs');
// var fsasync  = promise.promisifyAll(fs);
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
		},
		{
			paranoid: true,
			classMethods: classMethods,
			instanceMethods: instanceMethods,
		}
	);

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
	files_path: function() {
		let cfg = tender.config.storage;
		return path.join(cfg.path, 'tender', this.id.toString());
	},

	files_list: function() {

		let rt = this.files_path();
		let path_rem_count = rt.split(path.sep).length;

		return new promise(function(res, rej){
			let files = [];
			let w = walk.walk(rt);

			debug('load files from', rt);

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
				res(files);
			});

			w.on('errors', function(root, stats, next){
				debug('unhandled file ls error', root, stats);
				if (false) {
					rej(new Error(stats));
					/*
						[ { name: '3',
						error:
						 { [Error: ENOENT: no such file or directory, lstat 'data/storage/tender/3']
						   errno: -2,
						   code: 'ENOENT',
						   syscall: 'lstat',
						   path: 'data/storage/tender/3' } }
						]
       					*/
				}
				next();
			});
		});
	},

}
