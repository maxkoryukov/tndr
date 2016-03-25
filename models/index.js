"use strict";

/*

DO NOT USE THIS MODULE IN YOUR MODULES.

You could pick appropriate model from your app.models
The models should be registered there!

*/

var fs              = require('fs');
var mkdirp          = require('mkdirp-bluebird');
var path            = require('path');
var Sequelize       = require('sequelize');
var basename        = path.basename(module.filename);
var envname         = process.env.NODE_ENV || 'production';
var config          = require(__dirname + '/../config/db.json')[envname];
var _               = require('lodash');
var debug           = require('debug')('tndr:models.index');
var promise         = require('bluebird');
var db              = {};

// ALWAYS: print config, when it is read from ENV:
debug(`ENV: ${envname}`);

var default_define = {
	"underscored": true,
	"freezeTableName": true
};

config.define = _.merge(config.define, default_define);
config.query = _.merge(config.define, { "raw": true } );
config.logging = debug;

if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
	var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
		if (config.dialect === 'sqlite') {
			let dbroot = path.dirname(config.storage);
			return mkdirp(dbroot);
		} else {
			return new promise(function (resolve, reject){
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


module.exports = db;
