module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var galileu = Schema({
	  temp : Number,
 	  umidade : Number,
 	  data : String
	});


	return db.model('galileu', galileu);
};

