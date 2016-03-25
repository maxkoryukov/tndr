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

	it('person should exist', function () {
		models = require(models_path);
		assert.property(models, 'person');
	});

	describe('person', function() {
		var e = null;

		beforeEach(function(){
			e = models.person.build();
		});

		_.each(['person', 'name', 'surname', 'phone', 'note'], function(key){
			it(`should exists property [${key}]`, function () {
				assert.property(e, key);
			});
		});

		_.each(['person1', 'year'], function(key){
			it(`should NOT exists property [${key}]`, function () {
				assert.notProperty(e, key);
			});
		});


		describe('person.getPhoneLink()', function(){
			it('should exists', function() {
				assert.property(e, 'getPhoneLink');
				assert.isFunction(e.getPhoneLink);
			});


			var cases = [
				['', null],
				['asdf', null],
				['79996661166', 'tel:+79996661166'],
				['+7 (999) 666-11-66', 'tel:+79996661166'],
			];

			_.each(cases, function(c){
				it(`should convert ${c}`, function(){
					e.phone = c[0];
					assert.equal(e.getPhoneLink(), c[1]);
				});
			});
		});
	});
});
