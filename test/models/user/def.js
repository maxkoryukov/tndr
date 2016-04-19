var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

/* COMMON MODEL INIT BLOCK */
var models = require(path.join(process.cwd(), 'test', 'models', 'init'));
/* COMMON MODEL INIT BLOCK */


describe('tndr.models', function() {

	it('user should exist', function () {
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

		_.each(['id', 'username', 'password', 'person'], function(key){

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
