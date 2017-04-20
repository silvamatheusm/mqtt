module.exports = function(app){
	var raspberry = app.models.raspberry;
	var edison = app.models.edison;
	var galileo = app.models.galileo;

	var HomeController = {
		index: function(request,response){
			
				var rasps;
				var edisons;
				var dataR = new Array();
				var dataE = new Array();
				var dataG = new Array();
				raspberry.find({}, function(err, docs) {//docs é um array dos objetos da collection raspberry
					if (!err){ 
	    				rasps = JSON.parse(JSON.stringify(docs));//copia array de objetos para variavel rasps
	    				rasps.forEach(function(d){
	    					var str1 = d.data;
							var res = str1.split(" ", 3);
							dataR.push(res);
	    				});  
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});

				edison.find({}, function(err, docs) {//docs é um array dos objetos da collection edison
					if (!err){ 
	    				edisons = JSON.parse(JSON.stringify(docs));	//copia array de objetos para variavel edison
	    				rasps.forEach(function(d){
	    					var str1 = d.data;
							var res = str1.split(" ", 3);
							dataE.push(res);
	    				});  
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});
				galileo.find({}, function(err, docs) {//docs é um array dos objetos da collection galileu
					if (!err){ 
						//enviando os arrays para a view home/index.ejs
						docs.forEach(function(d){
							var str1 = d.data;
							var res = str1.split(" ", 3);
							dataG.push(res);
						})
						response.render('home/index',{rasps:rasps,edisons:edisons, galileos:docs});
	    				//response.render('home/index',{rasps:rasps,edisons:edisons, galileus:docs,
	    											//  dataG:dataG, dataE: dataE, dataR: dataR});
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});
			},
		ligaG: function(req,res){
				var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {
			  	//client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
			  	client.publish('galileu', '1');
			  	console.log('\nLed Galileo ligado');
				});
				res.redirect('/');
			},
		desligaG : function(req,res){
			var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {
			  	//client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
			  	client.publish('galileu', '0');
			  	console.log('\nLed Galileo Desligado');
				});
				res.redirect('/');
		},
		ligaR: function(req,res){
				var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {
			  	//client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
			  	client.publish('raspberry', '1');
			  	console.log('\nLed Raspberry ligado');
				});
				res.redirect('/');
			},
		desligaR : function(req,res){
			var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {
			  	//client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
			  	client.publish('raspberry', '0');
			  	console.log('\nLed Raspberry Desligado');
				});
				res.redirect('/');
		},
		ligaE: function(req,res){
				var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {
			  	//client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
			  	client.publish('edison', '1');
			  	console.log('\nLed Edison ligado');
				});
				res.redirect('/');
			},
		desligaE : function(req,res){
			var client  = require('mqtt').connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
				client.on('connect', function () {
			  	//client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
			  	client.publish('edison', '0');
			  	console.log('\nLed Edison Desligado');
				});
				res.redirect('/');
		}

		}
		/*
		var media = function(microcontrolers){
			var dias[];
			microcontrolers.forEach(function(m){
				var dia = m.data.split(" ",3);
				if(dia[2] == 10){
					alert('Dia 10');
				}
			})
		};*/
	
	return HomeController;
}
