/*
 * @module hbs-helpers/date
 */

"use strict";

var hbs    = require('hbs');
var moment = require('moment');

hbs.registerHelper('date', function(context, options) {
	if (!options && context.hasOwnProperty('hash')) {
		options = context;
		context = undefined;

		if (this.publishedDate) {
			context = this.publishedDate;
		}
	}

	// ensure that context is undefined, not null, as that can cause errors
	context = context === null ? undefined : context;

	var f = options.hash.format || 'll',
		timeago = options.hash.timeago,
		date;

	if ('iso'===f){
		f = null;
	}
	// if context is undefined and given to moment then current timestamp is given
	// nice if you just want the current year to define in a tmpl
	if (timeago) {
		date = moment(context).fromNow();
	} else {
		date = moment(context).format(f);
	}
	return date;
});
