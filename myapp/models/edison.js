module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var edison = Schema({
	  temp : Number,
 	  umidade : Number,
 	  data : String
	});


	return db.model('edison', edison);
};

