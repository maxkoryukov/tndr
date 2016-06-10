"use strict";

let m = {
};

m.Forbidden = function(){
	this.toString = function(){ return 'Forbidden';};
};

exports = module.exports = m;
