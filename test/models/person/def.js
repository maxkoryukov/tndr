var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

/* COMMON MODEL INIT BLOCK */
var models = require(path.join(process.cwd(), 'test', 'models', 'init'));
/* COMMON MODEL INIT BLOCK */


describe('tndr.models', function() {

	it('person should exist', function () {
		assert.property(models, 'person');
	});

	describe('person', function() {
		var e = null;

		beforeEach(function(){
			e = models.person.build();
		});

		_.each(['id', 'name', 'surname', 'phone', 'note'], function(key){
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
