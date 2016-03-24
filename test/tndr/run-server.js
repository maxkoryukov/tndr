
var assert = require('chai').assert;
var path   = require('path');

var modpath = path.join(process.cwd(), 'tndr');
var model_init_test = path.join(process.cwd(), 'test', 'models', 'init');
var mi = require(model_init_test);

describe('tndr', function() {

	describe('run and re-run', function(){

		[
			'run out of the box',
			'should run after restart',
		].forEach(function(description){
			it(description, function (done) {
				var tndr = require(modpath);
				var server = tndr.listen(3000);
				assert.isTrue(true);
				server.close(done);
			});
		});
	});
});
