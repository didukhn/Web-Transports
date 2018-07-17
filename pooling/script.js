window.onload = main;

function main() {
    $('#myModal').modal('show');

  var userHeader = document.getElementById('userHeader');
  var nameBtn = document.getElementById('nameButton');
  var nameInput = document.getElementById('nameInput');
  var messages = document.getElementById('messages');
  var users = document.getElementById('users');
  var text = document.getElementById('text');
  var textSubmit = document.getElementById('textSubmit');
   var nickNameInput = document.getElementById('nickNameInput');

  var userName = 'User Name';
  userHeader.innerText = userName;

  nameBtn.onclick = function () {
    userName = nameInput.value || 'User Name';
    userNickName = nickNameInput.value || 'nickname';
    userHeader.innerText = userName+` (@${userNickName})`;
    var data = {
      name: userName,
      nickName: userNickName
    };
    ajaxRequest({
      method: 'POST',
      url: '/users',
      data: data
    })
  };

  textSubmit.onclick = function () {
    var data = {
      name: userName,
      text: text.value,
      date: new Date()
    };
    text.value = " ";
    ajaxRequest({
      method: 'POST',
      url: '/messages',
      data: data
    })
  };


  var ajaxRequest = function (options) {
    var url = options.url || '/';
    var data = options.data || {};
    var method = options.method || 'GET';
    var xmlHttp = new XMLHttpRequest();
    var callback = options.callback;

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.status == 200 && xmlHttp.readyState == 4)
        callback && callback(xmlHttp.responseText);
    }
  }

  var getData = function () {
    ajaxRequest({
      url: '/messages',
      method: 'GET',
      callback: updateMessages,
    });

    ajaxRequest({
      url: '/users',
      method: 'GET',
      callback: updateUsers,
    });
  }

  var updateMessages = function (msg) {
    msg = JSON.parse(msg);

    messages.innerHTML = '';
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

  }

  setInterval(getData, 1000);

  

   function updateUsers(rawUsers) {
    users.innerHTML = '';
    for (var user of JSON.parse(rawUsers)) {
      
      var newUser = document.createElement('li');
      newUser.innerText = user.name + ` (@${user.nickName})`;
      
      users.appendChild(newUser);
    }
  }
}
