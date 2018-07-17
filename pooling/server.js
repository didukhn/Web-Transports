const app= require('express')();
const bodyParser = require('body-parser');
//const http=require('http').Server(app);
//const io=require('socket.io')(http);

app.use(bodyParser.json());

var messages=[];
var users=[];

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function(req,res){
  res.sendFile(__dirname + '/script.js');
});

app.get('/messages', function(req, res) {
  res.json(messages);
});

app.post('/messages', function(req, res) {
  messages.push(req.body);
  if(messages.length>100){
    messages=messages.slice(-100);
  }
  res.status(200).end();
})


app.get('/users', function(req,res){
  res.json(users);
})

app.post('/users', function(req,res){
  users.push(req.body);
  res.status(200).end();
})

//io.on('connection', function(){
  //console.log('Connected');
//})

app.listen(5000, function(){
  console.log('Listening on port 5000');
})
