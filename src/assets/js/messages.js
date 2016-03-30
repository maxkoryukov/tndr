/*
 * @module js.messages
 *
 * Implements messages showing on the client side
 */

var MSG = {
	success : function(){ return 'alert-success'; },
	error : function(){ return 'alert-danger'; },
	warn : function(){ return 'alert-warning'; },
	info : function(){ return 'alert-info'; },
};

function showMessage(loglevel, message){

	var source   = $("#messages-template-hbs").html();
	var template = Handlebars.compile(source);

	var cssclass = MSG.info();
	if (_.isFunction(loglevel)){
		cssclass = loglevel();
	} else {
		message = '' + (loglevel || '') + ' ' + (message || '');
	}

	var msghtml = template({
		body: message,
		cssclass: cssclass,
	});

	$('.tndr-messages').append(msghtml);
}
