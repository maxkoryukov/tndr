var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

/* COMMON MODEL INIT BLOCK */
var models = require(path.join(process.cwd(), 'test', 'models', 'init'));
/* COMMON MODEL INIT BLOCK */

describe('tndr.models', function() {
	it('builder should exist', function () {
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
