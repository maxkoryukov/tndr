"use strict";

var path   = require('path');
var assert = require('chai').assert;

// path to module to test
var modpath = path.join(process.cwd(), 'routes', 'builder');

describe('tndr.routes', function() {
	describe('builder', function() {
		it('should be requirable', function () {
			let route = require(modpath);
			assert.isNotNull(route);
		});
	});
});
