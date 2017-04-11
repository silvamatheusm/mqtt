module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var raspberry = Schema({
	  temp : Number,
 	  umidade : Number,
 	  data : String
	});


	return db.model('raspberry', raspberry);
};

