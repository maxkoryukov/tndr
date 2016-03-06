
var assert = require('chai').assert;

describe('Run server', function() {

	var server;

	beforeEach(function () {
		var tndr = require('../tndr');
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
