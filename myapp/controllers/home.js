module.exports = function(app){
	var raspberry = app.models.raspberry;
	var edison = app.models.edison;
	var galileo = app.models.galileo;

	var HomeController = {
		index: function(request,response){
			
				var rasps;
				var edisons;
			
				raspberry.find({}, function(err, docs) {//docs é um array dos objetos da collection raspberry
					if (!err){ 
	    				rasps = JSON.parse(JSON.stringify(docs));//copia array de objetos para variavel rasps
	    			  
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});

				edison.find({}, function(err, docs) {//docs é um array dos objetos da collection edison
					if (!err){ 
	    				edisons = JSON.parse(JSON.stringify(docs));	//copia array de objetos para variavel edison
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});
				galileo.find({}, function(err, docs) {//docs é um array dos objetos da collection galileu
					if (!err){ 
						response.render('home/index',{rasps:rasps,edisons:edisons, galileos:docs});
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});
			},
		ligaG: function(req,res){
				var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {			 
			  	client.publish('galileo', '1');
			  	console.log('\nLed Galileo ligado');
				});
				res.redirect('/');
			},
		desligaG : function(req,res){
			var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {			  
			  	client.publish('galileo', '0');
			  	console.log('\nLed Galileo Desligado');
				});
				res.redirect('/');
		},
		ligaR: function(req,res){
				var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {			  
			  	client.publish('raspberry', '1');
			  	console.log('\nLed Raspberry ligado');
				});
				res.redirect('/');
			},
		desligaR : function(req,res){
			var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {			 
			  	client.publish('raspberry', '0');
			  	console.log('\nLed Raspberry Desligado');
				});
				res.redirect('/');
		},
		ligaE: function(req,res){
				var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {			
			  	client.publish('edison', '1');
			  	console.log('\nLed Edison ligado');
				});
				res.redirect('/');
			},
		desligaE : function(req,res){
			var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {			  
			  	client.publish('edison', '0');
			  	console.log('\nLed Edison Desligado');
				});
				res.redirect('/');
		}

		}

	
	return HomeController;
}
