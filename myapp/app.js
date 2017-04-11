var express 	 = require('express');
var path		 = require('path');
var favicon 	 = require('serve-favicon');
var logger 		 = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose 	 = require('mongoose');
var uri 		 = 'mongodb://localhost/banco'; //usando mongoose ao conectar bd 'banco'
var options 	 = { db: { native_parser: true }  
  , server: { poolSize: 5 }//até 5 acessos multiplos ao banco de dados
  , replset: { rs_name: 'myReplicaSetName' }
};
global.db        = mongoose.connect(uri,options,function(erro){//estabelecendo conexao com bd
				if(erro)
				   console.log('Problema ao conectar o mongodb');
				else
					console.log('Conectado ao mongodb');
				});

var load 		= require('express-load');

var app 		= express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler

load('models')
	.then('controllers')
	.then('routes')
	.into(app);

app.listen(3000, function(){
	console.log("Myapp na porta 3000");
});