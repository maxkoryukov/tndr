var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

var models_path     = path.join(process.cwd(), 'models');

describe('tndr.models', function() {
	it('models.person should exist', function () {
		var models = require(models_path);
		assert.property(models, 'person');
	});

	var p = null;

	beforeEach(function(next){
		var models = require(models_path);
		//models.init().then(done);

		p = models.person.build();
		next();
	});

	describe('person', function() {

		_.each(['person', 'name', 'surname', 'phone', 'note'], function(key){
			it(`should have property [${key}]`, function () {
				assert.property(p, key);
			});
		});

		_.each(['person1', 'year'], function(key){
			it(`should NOT have property [${key}]`, function () {
				assert.notProperty(p, key);
			});
		});

	});
});
