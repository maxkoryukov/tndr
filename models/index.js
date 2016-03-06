"use strict";

var fs              = require('fs');
var mkdirp          = require('mkdirp');
var path            = require('path');
var Sequelize       = require('sequelize');
var basename        = path.basename(module.filename);
var envname         = process.env.NODE_ENV || 'development';
var config          = require(__dirname + '/../config/db.json')[envname];
var _               = require('lodash');
var debug           = require('debug')('tndr:models.index');

var db              = {};

var default_define = {
	"underscored": true,
	"freezeTableName": true
};

config.define = _.merge(config.define, default_define);

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

Object.keys(db).forEach(function(modelName) {
	if (db[modelName].associate) {
		db[modelName].associate(db);
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
	// sqlite required the path exists. only sqlite
	if (config.dialect === 'sqlite') {
		let dbroot = path.dirname(config.storage);
		mkdirp(dbroot);
	}

	return sequelize
		.sync()
		.then(function(){
			return db.user
				.count( { where: { username : 'root' } } )
				.then(function(cnt){
					if (0 === cnt){
						debug('INIT: create root');
						return db.user.create({
								user: 1,
								username: 'root',
								password: '123',
							});
					}
					// else
					return;
				})
		})

		.return(db);
};


module.exports = db;
