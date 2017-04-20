var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org',[{ host: 'localhost', port: 1883 }])
var mongoose = require('mongoose');
var uri = 'mongodb://localhost/banco'; //usando mongoose ao conectar bd 'banco'
var options = { db: { native_parser: true }  
  , server: { poolSize: 5 }//até 5 acessos multiplos ao banco de dados
  , replset: { rs_name: 'myReplicaSetName' }
}

mongoose.Promise = global.Promise;//evitando erros com Promises
mongoose.connect(uri,options,function(erro){//estabelecendo conexao com bd
  if(erro)
    console.log('Problema ao conectar o mongodb');
  else
    console.log('Conectado ao mongodb');
});

var Schema = require('mongoose').Schema;

//criando os modelos para adicionar no banco
var raspberry = Schema({
    temp : Number,
    umidade: Number,
    data : String
  });
var raspberry = mongoose.model('raspberry',raspberry);//raspberry é a colection

var edison = Schema({
  temp : Number,
  umidade: Number,
  data : String
});
var edison = mongoose.model('edison',edison);

var galileo = Schema({
  temp : Number,
  umidade: Number,
  data : String
});
var galileo = mongoose.model('galileo',galileo);


client.on('connect', function () {
  client.subscribe('microcontroladores')//assinando topico 'microcontroladores'
  //client.publish('raspberry', 'Estou no node.js')

})

//message enviada: {"microcontrolador":"edison", "temp":37, "umidade":29 }
 
client.on('message', function (topic, message) {//quando enviar/receber mensagem
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
    }else if(obj.microcontrolador == 'galileo') {
      var modelo = new galileo({
        temp: obj.temp,
        umidade: obj.umidade,
        data: data.toString()
      });
      salvar(modelo);
    }else if(obj.microcontrolador)
      console.log(obj.microcontrolador+' nao cadastrado no banco de dados');
    else
        console.log('Mensagem fora do padrao');
  }
})

//função para salvar no banco de dados
salvar = function(modelo){
    modelo.save(function(erro){
      if(erro)
        console.log('Erro ao salvar no banco de dados: '+erro);
      else
        console.log('Salvo no banco de dados');
    });
}

function IsJsonString(str){
  try{
   JSON.parse(str);
  }catch (e) {
     return false;
   }
    return true;
}
//loop infinito

