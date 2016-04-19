var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

/* COMMON MODEL INIT BLOCK */
var models = require(path.join(process.cwd(), 'test', 'models', 'init'));
/* COMMON MODEL INIT BLOCK */


describe('tndr.models', function() {

	it('tender should exist', function () {
		assert.property(models, 'tender');
	});

	describe('tender', function() {
		var e = null;

		beforeEach(function(){
			e = models.tender.build({
				estimator: null,
				fake_123: 1000,
			}, {
				include: models.tender.reflist
			});
		});

		_.each(['id', 'name', 'simpro_quote_number',
				'opening_date', 'closing_date', 'state_code',
				'estimator',
			], function(key){
			it(`should exists property [${key}]`, function () {
				assert.property(e, key);
			});
		});

		it('should not have field, not defined in model, but defined in build', () => {
			assert.notProperty(e, 'fake_123');
		});
	});
});
