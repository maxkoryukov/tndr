
var assert = require('chai').assert;

describe('Dumb', function() {

	var server;

	beforeEach(function () {
		server = require('../bin/www');
	});

	afterEach(function (done) {
		//server.close(done);
	});

	it('should be true', function () {
		assert.isTrue(true);
	});
});
