# Servidor node.js usando MQTT que assina determinado tópico e salva em banco de dados NoSQL.
O projeto consiste em assinar um tópico via MQTT, salvar num banco de dados MongoDB e mostrar uma tabela com os dados coletados, assim como permitir a publicação de mensagens MQTT pré-programadas via botões.
O servidor recebe dados de microcontroladores, como temperatura e umidade, e armazena os dados para posterior análise, e envia informação para acender leds nos microcontroladores.

* [Notas](#notas)
* [Instalação](#install)
* [Divisão do projeto](#divisao)
* [Assinando um tópico](#subscrible)
* [Salvar dados em MongoDB](#save)
* [FrameWork Express](#express)
* [Mostrando dados numa tabela HTML](#html)
* [Publicando a partir de botões](#publish)


<a name="notas"></a>
## Pré-requisitos 
É recomendado que se tenha o mínimo de conhecimento em programação web, [JSON](http://www.json.org/json-pt.html), [node.js](https://nodejs.org/en/) e protocolo [MQTT](https://blog.butecopensource.org/mqtt-parte-1-o-que-e-mqtt/). Este tutorial tem como objetivo explicar o funcionamento deste projeto.

<a name="install"></a>
## Instalação
Instale o nodejs, que pode ser baixado [aqui](https://nodejs.org/en/). Baixe o instalador e execute-o normalmente. Se não ocorrer problemas, abra seu terminal e digite `node -v`para ver a versão instalada.

Baixe e instale o [git](https://git-scm.com/downloads).Clone este projeto para uma pasta de sua preferência. No terminal, digite:
	```
	  git clone https://github.com/silvamatheusm/mqtt.git
	```
Para instalar as dependências do projeto, como os framworks express e mongoose, utilizado para facilitar o trabalho com MongoDB, entre outros,  digite no terminal:
	```
	npm install
	```
Agore instale o MongoDB em sua máquina. Acesse o link do [mongoDB](https://www.mongodb.com/download-center#community:) e baixe-o. Extraia no diretório raiz do Windows. Crie um diretório data no raiz. Entre no diretório data e crie o diretório db.

<a name="divisao"></a>
## Divisão do projeto
Para melhor organização, o projeto está dividido em dois arquivos node, ou duas partes: uma que usa apenas a biblioteca [mqtt](https://github.com/mqttjs/MQTT.js) e o framework mongoose, para assinar tópicos e salvá-los num banco de dados, e outra parte usando Express, para criar uma página http, mostrando num site as informações salvas no banco de dados, assim como permitir a publicação em topicos através de botões. As duas rodam ao mesmo tempo, a primeira apenas no terminal, que tem por finalidade receber os dados e salvá-los,e a segunda mostrando as informações.

<a name="subscrible"></a>
## Assinando um tópico
A primeira parte do projeto será chamada __mqtt.js__.
Para assinar um tópico, vamos utilizar a biblioteca mqtt.js do node, que pode ser acessada por https://github.com/mqttjs/MQTT.js .

```js
	var mqtt = require('mqtt')
	var client  = mqtt.connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
```
Este primeiro trecho acessa o framework e configura o broker a ser utilizado, neste caso, 'iot.eclipse.org'. Você pode utilizar o broker que preferir. A variavel client salva todas essas informações, sendo ela a utilizada para publicar e assinar tópicos, como veremos a seguir.

```js
	client.on('connect', function () {
 	 client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
```
Aqui conectamos ao broker e assinamos o tópico 'microcontroladores'. Você pode assinar o tópico que quiser.

```js
	client.on('message', function (topic, message) {
   	// message is Buffer 
  	var mensagem = message.toString();//converte a mensagem buffer em string
```
Passando como argumento 'message' para a função 'on' de client, acessaremos a função todas as vezes que uma mensagem for publica no tópico que assinamos. Recebemos como parâmetro `topic` e `message`, sendo o primeiro a string do tópico assinado e o segundo um buffer com a mensagem. Para transformar numa string, usamos o metodo `toString()` e salvamos na variavel `mensagem`. Essa é a mensagem que será salva no banco de dados.

<a name="save"></a>
## Salvando num banco de dados
O mongoDB salva as informações no formato JSON, e o mongoose usa modelos e esquemas para guardar as informações.

```js
	var mongoose = require('mongoose');
	var uri = 'mongodb://localhost/banco'; //bando de dados 'banco'
	var options = { db: { native_parser: true }  
	  , server: { poolSize: 5 }//até 5 acessos multiplos ao banco de dados
	  , replset: { rs_name: 'myReplicaSetName' }
	}
	mongoose.connect(uri,options,function(erro){//estabelecendo conexao com bd
	  if(erro)
	    console.log('Problema ao conectar o mongodb');
	  else
	    console.log('Conectado ao mongodb');
	});
```
Configuramos para acessar um banco de dados chamado 'banco'(se não existir, será criado), e passamos algumas preferências, salvas na variavel options. Estabelecemos a conexão com `mongoose.connect`, que recebe como parâmetro o endereço do banco mongoDB e as opções desejadas e, caso ocorra algum erro, informamos no console que houve um erro ao se conectar.

```js
	var Schema = require('mongoose').Schema;

	//criando os modelos para adicionar no banco
	var raspberry = Schema({
	    temp : Number,
	    umidade: Number,
	    data : String
	  });
	var raspberry = mongoose.model('raspberry',raspberry);//raspberry é a colection
```
A variavel `Schema` salva a estrutura de modelos do mongoose, que é usada para criar nosso próprios modelos. Exemplificamos o modelo `raspberry`, que tem três 'atributos': temperatura, umidade e data. Para concluir o modelo, usamos o método `mongoose.model` para salvar o método e já dar nome a nossa collection, que também será chamada de raspberry.
Também fizemos o mesmo com os esquemas `galileo` e `edison`.

```js
	client.on('message', function (topic, message) {//quando receber mensagem
	   // message is Buffer 
	  var data = new Date();//criando objeto date
	  var mensagem = message.toString();//converte a mensagem buffer em string
	  if(IsJsonString(mensagem)){//se for um json valido
	    var obj = JSON.parse(mensagem);//transforma em objeto
	    console.log("\nObjeto.microcontrolador: "+obj.microcontrolador);
	    console.log("Objeto.temperatura: "+obj.temp);
	 
	 if(obj.microcontrolador == "raspberry"){
	      var modelo = new raspberry({
		temp: obj.temp,
		umidade: obj.umidade,
		data: data.toString()
	      });
	      salvar(modelo);
	    }else if(obj.microcontrolador == 'edison') {
	      var modelo = new edison({
		temp: obj.temp,
		umidade: obj.umidade,
		data: data.toString()
	      });
	      salvar(modelo);
	    }
	  }
	})
	
	salvar = function(modelo){
	    modelo.save(function(erro){
	      if(erro)
		console.log('Erro ao salvar no banco de dados: '+erro);
	      else
		console.log('Salvo no banco de dados');
	    });
	}
```
Receberemos a mensagem no formato JSON, contendo o nome do microcontrolador, a temperatura e a umidade, e salvaremos a data e hora atuais. Voltando ao método `client.on`, criamos a variavel `data`, que salva a data e hora atuais. Usamos a função `IsJsonString` para validar a mensagem recebida. Caso seja válida, transformamos a mensagem num objeto chamado `obj` com o metodo `JSON.parse`. Usamos uma lógica simples com `if` para saber qual microcontrolador está mandando as informações e em qual collection será salvo o objeto. Criamos uma variavel `modelo`, instanciamos o modelo que será utilizado e passamos para a função `salvar`, que finalmente salva no banco de dados.

Isso encerra o arquivo __mqtt.js__, onde recebemos a informação do tópico 'microcontroladores' e salvamos no banco de dados em três collections diferentes: raspberry, galileo e edison. Para executar, digite `node mqtt.js` no terminal.

<a name="express"></a>

## Framework Express
Para a segunda parte do projeto, usaremos o [Framework Express](http://expressjs.com/), que facilita o desenvolvimento de servidores com NODE.JS. O Express baseia-se no modelo MVC(Model-View-Controller) e MVR(Model-View-Route). Teremos o diretório 'Views', com as paginas a serem exibidas com ejs, que é uma engine de visualização, o diretório 'Controllers', com a lógica para ler os arquivos do banco de dados, 'Models', com os modelos para o banco de dados e 'Routes', com as rotas do servidor.

Essa segunda parte do projeto será feita no diretório `myapp`. O arquivo principal é o `app.js`:

```js
	var express 	 = require('express');
	var path	 = require('path');
	var favicon 	 = require('serve-favicon');
	var logger 	 = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser   = require('body-parser');
	var mongoose 	 = require('mongoose');
	var uri 	 = 'mongodb://localhost/banco'; //usando mongoose ao conectar bd 'banco'
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

	var load 	 = require('express-load');

	var app 	 = express();
```

Configuramos os módulos a serem utilizados, como o próprio express e o mongoose, e iniciamos o express com a variavel `app`, onde todas as funcionalidades do framework são habilitadas. A variavel `db` é global, sendo utilizada por todos os arquivos do projeto.

```js
	//...
		load('models')
		.then('controllers')
		.then('routes')
		.into(app);

	app.listen(3000, function(){
		console.log("Myapp na porta 3000");
	});
```
Com o método load, carregamos os models, os controllers e as routes, para linkar os respectivos diretórios, e colocamos o servidor na porta 3000 com `app.listen`.

## Models
No diretório Models, temos os arquivos `edison.js`, `galileo.js` e `raspberry.js`, contendo os modelos para mongoose, que são utilizados para ler o banco de dados. Por exemplo, o arquivo `edison.js`:

```js
	module.exports = function(app) {
		var Schema = require('mongoose').Schema;

		var edison = Schema({
		  temp : Number,
	 	  umidade : Number,
	 	  data : String
		});


		return db.model('edison', edison);
	};
```

Criamos o modelo, exatamente como criamos o modelo anteriormente em `mqtt.js` para salvar no banco de dados, e retornamos o modelo com a variavel `db`.
Do mesmo modeo, são feitos os models raspberry e galileo.

## Controllers
O diretório Controllers tem apenas um arquivo, o `home.js`.

Os modelos sao requisitados do diretório `models`:
```js
	var raspberry = app.models.raspberry;
	var edison = app.models.edison;
	var galileo = app.models.galileo;
```

Criamos a variável `HomeController`, que tem todas as actions , e retornaremos ela no final, dessa forma:

```js
	var HomeController = {
		index: function(request,response){
		//codigo...
		}	
	}
	return HomeController;
```

Dentro da action `index`:
```js
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
```
O comando `raspberry.find({},function(err,docs)` retorna todos os arquivos salvos na collection raspberry como array de objetos na variavel `docs` e, se houver algum erro, a variável `err` armazena o log do erro. Caso não ocorra nenhum erro, copiamos o array de objetos para a variavel `rasps`, transformando docs em uma string de JSON e depois em um objeto.
O mesmo ocorre com o edison, salvando o array objetos edisons na variavel `edisons`.

```js
	galileo.find({}, function(err, docs) {//docs é um array dos objetos da collection galileu
		if (!err){ 				
			response.render('home/index',{rasps:rasps,edisons:edisons, galileos:docs});		
	   	} else{
	   		console.log('Erro na index');
	    		throw err;
	   	}
	});
```
Já dentro de `galileo.find()`, usamos a função `response.render`, para mandar para a view `home/index` os arrays contendo as informações salvas no banco de dados, dentro das variaveis `rasps, edisons e galileos `.

<a name="html"></a>
## Mostrando dados numa tabela HTML
## Views
Usamos o templete engine [EJS](http://ejs.co/), para facilitar a integração entre HTML e Javascript.
No diretório `Views/home`, temos o arquivo `index.ejs`, que é onde os dados serão exibidos.É utilizado __bootstrap__ para estilo da página.


```html
<table class="table table-striped">
	<thead>
		<tr>

		<th> Temperatura</th>
		<th> Umidade</th>
		<th> Data</th>

		</tr>
	</thead>
	<tbody>
		<% rasps.forEach(function(r) { %>
			<tr>

			<td> <%- r.temp %> </td>
			<td> <%- r.umidade %> </td>
			<td> <%- r.data%> </td>
			
			</tr>
		<% }) %>
	</tbody>
</table>
```
A tabela tem três colunas, temperatura, umidade e data, correspondendo aos atributos recebidos via `JSON` e salvos no banco de dados.
Como foi passado pelo Controller, temos disponîveis as variáveis `rasps, edisons e galileos`, contendo os arrays com as informações do banco de dados. Usamos o comando `rasps.forEach(function(r)` para varrer o array de `rasps`, sendo que é retornado em `r` o objeto iterado, contendo sua temperatura, umidade e data. Apenas com o comando `<td> <%- r.temp %> </td>`, já é passado para a linha da tabela os valores desejados, tudo isso graças ao EJS.

É feito este procedimento outras duas vezes, para as variaveis `edisons` e `galileos`.


<a name="publish"></a>
## Publicando a partir de botões

Agora já assinamos um tópico via MQTT, guardamos as informações num banco de dados mongoDB e mostramos ao usuário numa tabela.  Como exemplo, para publicar em um tópico, serão usados botões 'LigaLed/DesligaLed", que publicarão em um tópico espefícifo, como por exemplo, 'tópico raspberry', os números 1 e 0, sendo que o primeiro seria um comando para ligar o led do raspberry, e 0 para desligar. 

Logo abaixo das tabelas com as informações do raspberry, temos:

```html
	<form action="/ligaRasp" method="get">
		<button type="submit" class="btn btn-sm btn-success">Liga Led</button>
		<button type="submit" class="btn btn-sm btn-danger" formaction="/desligaRasp"   >Desliga Led</button>
	</form>

```
Se pressionado o botão `Liga Led`, iremos acionar a action `ligaRasp` pelo método get. Já se pressionado o botão `Desliga Led`, a action acionada será a `desligaRasp` também pelo método get, devido ao campo `formaction` estar preenchido.

## Routes
Dentro de routes, temos o arquivo `home.js`, que faz o roteamento do nosso servidor.

```js
	module.exports = function(app){
		var home = app.controllers.home;
		app.get('/', home.index);//chama a ação index em controllers/home
		app.get('/ligaRasp', home.ligaR);
		app.get('/desligaRasp', home.desligaR);
	}

```
A variável `home` recebe `HomeController` vinda do controller, através do `app` do Express. Por padrão, caso o endereço seja '/', a action acionada será a index. Já quando pressionamos o botão 'Liga Led' do raspberry, será acionado a action `ligaR` do controller, como veremos a seguir.
Em `controllers/home.js`, logo após a action `index`, temos:

```js
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
	}
```
A action `ligaR` faz requerimento novamente da biblioteca mqtt, assim como fizemos na primeira parte do projeto, estabelecendo assim a conexão com o broker `iot.eclipse.org`. A diferença está na função `client.on('connect')`, pois agora configuraremos para publicar em um tópico, através do método `client.publish`, e passando como parametro o tópico a ser assinado e a mensagem '1', que acenderia o led. Depois, mostramos no terminal uma mensagem confirmando que a operação de publicação foi confirmada,e redirecionamos a página. Da mesma forma, é feito para a action `desligaR`, mas mandamos a mensagem 'o' para apagar o led.

No projeto também constam mais quatro botões, que são os `Liga/Desliga Led` do galileo e do edison.
Para executar, digite `node app.js` dentro de `myapp`.

©Inatel
