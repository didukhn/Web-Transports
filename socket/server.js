const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var messages = [];
var users = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function (req, res) {
  res.sendFile(__dirname + '/script.js');
});

app.get('/main.css', function (req, res) {
  res.sendFile(__dirname + '/main.css');
});

io.on('connection', function (socket) {
  console.log('Connected');

  var CURRENT_USER;

  socket.on('chat message', function (msg) {
    msg.date = new Date();
    messages.push(msg);
    io.emit('chat message', msg);

  });

  socket.on('chat user', function (user) {
    CURRENT_USER = {
      name: user.name,
      nickName: user.nickName,
      isTyping: false,
      connectedAt: new Date(),
      disconnectedAt: null
    };

    var userInList = users.filter(x => x.nickName == user.nickName)[0];
    var index = users.indexOf(userInList);
    if (userInList)
      users.splice(index, 1);

    users.push(CURRENT_USER);

    io.emit('chat users update', users);
  })

  socket.emit('chat history', messages);

  socket.on('chat user typing', function () {
    CURRENT_USER.isTyping = true;
    io.emit('chat users update', users);
  });

  socket.on('chat user not typing', function () {
    CURRENT_USER.isTyping = false;

    io.emit('chat users update', users);
  });

  socket.on('disconnect', function () {
    if (!CURRENT_USER) return;

    CURRENT_USER.connectedAt = null;
    CURRENT_USER.disconnectedAt = new Date();

    console.log('disconnect');
    messages.push({
      name : 'BOT',
      text : CURRENT_USER.nickName + ' was disconnected',
      date : new Date()
    });

    io.emit('chat history', messages);
    io.emit('chat users update', users);
  });
});

http.listen(5000, function () {
  console.log('Listening on port 5000');
})
