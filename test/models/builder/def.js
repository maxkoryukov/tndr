var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

var models_path     = path.join(process.cwd(), 'models');

/* COMMON MODEL INIT BLOCK */
var model_init_test = path.join(process.cwd(), 'test', 'models', 'init');
var mi = require(model_init_test);
/* COMMON MODEL INIT BLOCK */


describe('tndr.models', function() {
	var models;

	it('builder should exist', function () {
		models = require(models_path);
		assert.property(models, 'builder');
	});

	describe('builder', function() {
		var e = null;

		beforeEach(function(){
			e = models.builder.build({
				builder_category: {
					id : 1,
				}
			},{
				include: [models.builder_category]
			});
		});

		_.each(['id', 'name', 'builder_category', 'builder_category_id'], function(key){
			it(`should exists property [${key}]`, function () {
				assert.property(e, key);
			});
		});


	});
});
