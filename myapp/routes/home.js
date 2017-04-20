module.exports = function(app){
	var home = app.controllers.home;
	app.get('/', home.index);//chama a ação index em controllers/home
	app.get('/ligaGalileo', home.ligaG);
	app.get('/desligaGalileo', home.desligaG);
	app.get('/ligaRasp', home.ligaR);
	app.get('/desligaRasp', home.desligaR);
	app.get('/ligaEdison', home.ligaE);
	app.get('/desligaEdison', home.desligaE);
}

