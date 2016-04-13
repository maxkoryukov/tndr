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

	it('tender should exist', function () {
		models = require(models_path);
		assert.property(models, 'tender');
	});

	describe('tender', function() {
		var e = null;

		beforeEach(function(){
			e = models.tender.build();
		});

		_.each(['id', 'name', 'simpro_quote_number', 'opening_date', 'closing_date'], function(key){
			it(`should exists property [${key}]`, function () {
				assert.property(e, key);
			});
		});


	});
});
