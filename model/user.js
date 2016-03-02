

var user = {
	'authenticate' : function authenticate(login, pwd){
		console.info('user.authenticate', login, pwd);
		return 1;
	},
};

module.exports = user;