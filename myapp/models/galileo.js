module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var galileo = Schema({
	  temp : Number,
 	  umidade : Number,
 	  data : String
	});


	return db.model('galileo', galileo);
};

