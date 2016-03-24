var assert = require('chai').assert;
var path   = require('path');
var _      = require('lodash');

var models_path = path.join(process.cwd(), 'models');

/*
THIS TEST is a preparation of DB for the other tests
*/

describe('tndr.models', function() {
	this.slow(10000);
	this.timeout(20000);

	it('init: should init without errors', function (done) {
		var models = require(models_path);
		models.init().then(function(){
			done();
		});
	});
});