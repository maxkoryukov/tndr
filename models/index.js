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
var promise         = require('bluebird');

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
	dbconfig.query = _.merge(dbconfig.define, { "raw": true } );
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
			return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
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

	/*
	==================================
	CREATE initial data
	==================================
	*/

	db.init = function init(){
		return (function mkdir(){
			if (dbconfig.dialect === 'sqlite') {
				let dbroot = path.dirname(dbconfig.storage);
				return mkdirp(dbroot);
			} else {
				return new promise(function (resolve){
					resolve();
				});
			}
		})()
			.return(sequelize)
			.call('sync', {
				logging: debug
			})
			.then(function(){
				/* CHECK FOR EMPTYNESS */
				return db.user
					.count( { where: { username : 'root' } } )
					.then(function(cnt){
						if (0 === cnt){
							debug('INIT DATA');


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
								})

								.then(db.builder_category.initialFill(db));
						}
						// else
						return;
					});
			})

			.return(db);
	};

	return db;
};

exports = module.exports = __init_mod;
