var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

var models_path     = path.join(process.cwd(), 'models');

/* COMMON MODEL INIT BLOCK */
var modpath = path.join(process.cwd(), 'tndr');
var model_init_test = path.join(process.cwd(), 'test', 'models', 'init');
var mi = require(model_init_test);
/* COMMON MODEL INIT BLOCK */


describe('tndr.models', function() {
	var models;

	it('user should exist', function () {
		models = require(models_path);
		assert.property(models, 'user');
	});

	describe('user', function() {

		var e = null;

		beforeEach(function(){
			e = models.user.build({
				person: {}
			}, {
				include : [models.person]
			});
		});

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
