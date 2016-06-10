"use strict";

/*

DO NOT USE THIS MODULE IN YOUR MODULES.

You could pick appropriate model from your app.models
The models should be registered there!

*/

var debug           = require('debug')('tndr:models:index');
var fs              = require('fs');
var path            = require('path');
var mkdirp          = require('mkdirp-bluebird');
var Sequelize       = require('sequelize');
var _               = require('lodash');

var basename        = path.basename(module.filename);

function __init_mod(config){

	let db = {};
	let dbconfig = config.db;
	let stconfig = config.storage;

	var default_define = {
		"underscored": true,
		"freezeTableName": true
	};

	dbconfig.define = _.merge(dbconfig.define, default_define);
	dbconfig.query = _.merge(dbconfig.define, { "raw": false } );
	dbconfig.logging = debug;

	var sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, dbconfig);

	/*
	==================================
	LOAD all models
	==================================
	*/

	fs
		.readdirSync(__dirname)
		.filter(function(file) {
			return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-7) === '.seq.js');
		})
		.forEach(function(file) {
			var model = sequelize['import'](path.join(__dirname, file));
			db[model.name] = model;
		});

	_(db)
		.keys()
		.each(function(model_name) {
			if (db[model_name].associate) {
				db[model_name].associate(db);
			}
		});

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;

	db.tender.config = config;

	/*
	==================================
	CREATE initial data
	==================================
	*/

	db.init = function init(){
		return mkdirp(stconfig.path)
			.then(() => {
				if (dbconfig.dialect === 'sqlite') {
					let dbroot = path.dirname(dbconfig.storage);
					return mkdirp(dbroot);
				}

				return;
			})
			.return(sequelize)
			.call('sync', {
				logging: debug
			})
			.then(function(){
				return db.user.count( { where: { username : 'root' } } )
			})
			.then(function(cnt){
				if (0 === cnt){
					// initial fill:
					return db.__initialFill();
				} else {
					return;
				}
			})

			.return(db)
		;
	};

	db.__initialFill = function(){

		debug('INIT DATA');

		let user_root = null;

		return db.user.create({
					user: 1,
					username: 'root',
					password: '123',
					person: {
						name: 'root',
						surname: 'root',
						note: 'System account',
					}
				},{
					include : [ db.person ],
				}
			)
			.then(u => user_root = u)
			.return([
				db.role,
				db.builder_category,
			])
			.map(m => m.initialFill(db))
			.spread((roles) => {
				return db.role.findOne({
					where: {code: 'root'},
					raw: false
				});
			})
			.then( root_role => {
				return user_root.addRole([root_role]);
			})

			.return(db)
		;
	};

	return db;
}

exports = module.exports = __init_mod;
