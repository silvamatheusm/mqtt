# Servidor node.js usando MQTT que assina determinado tópico e salva em banco de dados NoSQL.
O projeto consiste em assinar um tópico via MQTT, salvar num banco de dados MongoDB e mostrar uma tabela com os dados coletados, assim como permitir a publicação de mensagens MQTT pré-programadas via botões.


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
É recomendado que se tenha o mínimo de conhecimento em programação web, [JSON](http://www.json.org/json-pt.html), [node.js](https://nodejs.org/en/) e protocolo [MQTT](https://blog.butecopensource.org/mqtt-parte-1-o-que-e-mqtt/). Este tutorial tem como objetivo explicar o funcionamento do deste projeto.

<a name="install"></a>
## Instalação
Instale o nodejs, que pode ser baixado [aqui](https://nodejs.org/en/). Baixe o instalador e execute-o normalmente. Se não ocorrer problemas, abra seu terminal e digite `node -v`para ver a versão instalada.

Clone este projeto para uma pasta de sua preferência. No terminal, digite:
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
Passando como argumento 'message' para a função 'on' de client, acessaremos a função todas as vezes que uma mensagem for publica no tópico que assinamos. Recebemos como parâmetro `topic` e `message`, sendo o primeiro a string do tópico assinado e o segundo um buffer com a mensagem. Para transformar numa string, usamos o metodo `toString()` e salvamos na variavel mensagem. Essa é a mensagem que será salva no banco de dados.






