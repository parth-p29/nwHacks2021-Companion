var socket = io({ transports: ["websocket"], upgrade: false });

var day = new Date().getDate();

var userid = getUserId();
var username = getUserName();

var canmessage;
function getUserId() {
  var cookies = document.cookie;
  var state = false;
  cookies = cookies.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var key = cookies[i].split("=")[0];
    var sotr = cookies[i].split("=")[1];
    if (key.localeCompare(" userid") == 0) {
      return sotr;
    }
  }
  return false;
}

function getUserName() {
  var cookies = document.cookie;
  var state = false;
  cookies = cookies.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var key = cookies[i].split("=")[0];
    var sotr = cookies[i].split("=")[1];
    if (key.localeCompare(" username") == 0) {
      return sotr;
    }
  }
  return false;
}

function getPFP() {
  var cookies = document.cookie;
  var state = false;
  cookies = cookies.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var key = cookies[i].split("=")[0];
    var sotr = cookies[i].split("=")[1];
    if (key.localeCompare(" userimg") == 0) {
      return sotr;
    }
  }
  return false;
}

var form = document.getElementById("form");
var input = document.getElementById("input");

socket.on("connect", function () {
  var canmessage = false;
  console.log(socket.id);
  socket.emit("lookingforroom", socket.id, userid);
});

socket.on("checkforpartner", function () {
  console.log(socket.id);
  socket.emit("comparepartners", socket.id);
});

socket.on("matchFound", function () {
  canmessage = true;
  document.getElementById("waiting-msg").innerHTML = "Start chatting!";
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value && canmessage) {
    socket.emit("chat message", input.value, username, userid, day, socket.id);
    input.value = "";
  }
});

socket.on("chat message", function (msg, isender) {
  var item = document.createElement("li");
  var imgsrc = getPFP();
  if (isender == 0) {
    item.classList.add("mine");
  } else if (isender == 1) {
    item.classList.add("left");
  }
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

$(function () {
  $("form").on("submit", function (event) {
    event.preventDefault();
    var message = $(".message").first().clone();
    message.find("p").text($("input").val());
    message.prependTo("#messagebox");
    $("input").val("");
  });
});
