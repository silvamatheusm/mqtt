module.exports = function(app){
	var raspberry = app.models.raspberry;
	var edison = app.models.edison;
	var galileu = app.models.galileu;

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
				galileu.find({}, function(err, docs) {//docs é um array dos objetos da collection galileu
					if (!err){ 
						//enviando os arrays para a view home/index.ejs
	    				response.render('home/index',{rasps:rasps,edisons:edisons, galileus:docs});
	   				} else{
	   					console.log('Erro na index');
	    				throw err;
	   				}
				});
			}
		}
	
	return HomeController;
}
