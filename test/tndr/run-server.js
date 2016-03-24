
var assert = require('chai').assert;
var path   = require('path');

var mod_path     = path.join(process.cwd(), 'tndr');

describe('tndr', function() {

	var server;

	beforeEach(function () {
		var tndr = require(mod_path);
		server = tndr.listen(3000);
	});

	afterEach(function (done) {
		server.close(done);
	});

	it('should be runable out of the box', function () {
		assert.isTrue(true);
	});

	it('should run after restart', function () {
		assert.isTrue(true);
	});
});
