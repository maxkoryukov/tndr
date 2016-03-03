// FROM : https://gist.github.com/benw/3824204#file-load-hbs-partials-js


// Helps with this problem:
// http://stackoverflow.com/questions/8059914/express-js-hbs-module-register-partials-from-hbs-file

var hbs = require('hbs');
var fs = require('fs');

var partialsDir = __dirname + '/../views';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
	var matches = /^(_[^.]+).hbs$/.exec(filename);
	if (!matches) {
		return;
	}
	var name = matches[1];
	var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
	return hbs.registerPartial(name, template);
});
