window.onload = main;

function main() {
  $('#myModal').modal('show');
  var userHeader = document.getElementById('userHeader');

  var nameBtn = document.getElementById('nameButton');
  var nameInput = document.getElementById('nameInput');

  var nickNameInput = document.getElementById('nickNameInput');

  var messages = document.getElementById('messages');
  var users = document.getElementById('users');
  var text = document.getElementById('text');
  var textSubmit = document.getElementById('textSubmit');


  var userName = 'User Name';
  var userNickName = 'nickname'
  userHeader.innerText = userName;

  var socket = io.connect();

  nameBtn.onclick = function () {
    userName = nameInput.value || 'User Name';
    userNickName = nickNameInput.value || 'nickname';

    userHeader.innerText = userName + ` (@${userNickName})`;
    var data = {
      name: userName,
      nickName: userNickName
    };
    socket.emit('chat user', data)
  };

  textSubmit.onclick = function () {
    var data = {
      name: userName,
      nickName: userNickName,
      text: text.value,
      date: new Date()
    };
    text.value = " ";
    socket.emit('chat message', data);
  };

  var unactiveTimeout;

  text.addEventListener('keypress', function () {
    clearTimeout(unactiveTimeout);

    socket.emit('chat user typing');

    unactiveTimeout = setTimeout(() => {
      socket.emit('chat user not typing');
    }, 2000);
  });

  socket.on('chat history', function (msg) {
    // messages.innerHTML = '';
    for (var message of msg) {
      var newMsg = document.createElement('li');
      if (message.text.indexOf('@' + userName) != -1) {
        newMsg.classList.add('red');
      }
      newMsg.innerHTML = `
      <div class="message-orange">
      <div class="user-name">${message.name}</div>
        <p class="message-content">${message.text}</p>
        <div class="message-timestamp-right">${message.date}</div>
      </div>`;

      messages.appendChild(newMsg);

    }
  });

  socket.on('chat users update', updateUsers);

  socket.on('chat message', function (msg) {
    var newMsg = document.createElement('li');
    if (msg.text.indexOf('@' + userName) != -1) {
      newMsg.classList.add('red');
    }
    newMsg.innerHTML = `
      <div class="message-orange">
        <div class="user-name">${msg.name}</div>
        <p class="message-content">${msg.text}</p>
        <div class="message-timestamp-right">${msg.date}</div>
      </div>`;

    messages.appendChild(newMsg);
  })

  socket.on('chat user', function (user) {
    var newUser = document.createElement('li');
    newUser.innerText = user.name + ` ${user.nickName}`;
    users.appendChild(newUser);
  });


  function updateUsers(rawUsers) {
    var currDate = new Date();
    users.innerHTML = '';
    for (var user of rawUsers) {
      if (user.connectedAt)
        user.connectedAt = new Date(user.connectedAt);

      if (user.disconnectedAt)
        user.disconnectedAt = new Date(user.disconnectedAt);

      var newUser = document.createElement('li');
      newUser.innerText = user.name + ` (@${user.nickName})`;

      if (user.isTyping) {
        newUser.innerText += ' IS TYPING NOW . . .';
      }

      if (user.connectedAt && (currDate - user.connectedAt) / 1000 <= 60) {
        newUser.innerText += ' JUST APPEARED';
      } else if (user.connectedAt) {
        newUser.innerText += ' ONLINE';
      } else if (user.disconnectedAt && (currDate - user.disconnectedAt) / 1000 <= 60) {
        newUser.innerText += ' JUST LEFT';
      } else {
        newUser.innerText += ' OFFLINE';
      }
      users.appendChild(newUser);
    }
  }
}
