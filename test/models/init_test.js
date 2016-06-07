"use strict";

var path   = require('path');

describe('tndr.models', function() {
	this.slow(10000);
	this.timeout(20000);

	it('init: should init without errors', function (done) {
		var models = require(path.join(process.cwd(), 'test', 'models', 'init'));

		models.init().then(function(){
			done();
		});
	});
});
