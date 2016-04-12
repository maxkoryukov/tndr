
var assert = require('chai').assert;
var path   = require('path');

/* COMMON MODEL INIT BLOCK */
var modpath = path.join(process.cwd(), 'tndr');
var model_init_test = path.join(process.cwd(), 'test', 'models', 'init');
/*eslint quotes: ["off", "double"], curly: 2*/
var mi = require(model_init_test);
/* COMMON MODEL INIT BLOCK */

describe('tndr', function() {

	describe('run and re-run', function(){

		this.slow(800);

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
