var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

var models_path     = path.join(process.cwd(), 'models');

describe('tndr.models', function() {
	it('models.user should exist', function () {
		var models = require(models_path);
		assert.property(models, 'user');
	});

	var e = null;
	var models;

	before(function(next){

		setTimeout(next, 10*1000);

		models = require(models_path);
		models.init().then(function(){
			next();
		});
	});

	beforeEach(function(){
		e = models.user.build({
			person: {}
		}, {
			include : [models.person]
		});
	});

	describe('user', function() {

		_.each(['user', 'username', 'password', 'person'], function(key){

			it(`should have property [${key}]`, function () {
				assert.property(e, key);
			});
		});

		_.each(['person1', 'year'], function(key){
			it(`should NOT have property [${key}]`, function () {
				assert.notProperty(e, key);
			});
		});

	});
});
