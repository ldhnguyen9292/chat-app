const socket = io();

document.getElementById("form_message").addEventListener("submit", (event) => {
  event.preventDefault();

  const messageText = document.getElementById("input_message").value;
  const acknowledgements = (error) => {
    if (error) return alert(error);
    console.log("Tin nhắn đã thành công");
  };
  socket.emit("send_message_to_server", messageText, acknowledgements);
});

socket.on("welcome_to_client", (messages) => {
  document.getElementById("mess_box").innerHTML += `
  <span>${messages.message} (<span>${messages.createAt}</span>)</span>
  </br>
  `;
});

socket.on("send_message_to_client", (messages) => {
  document.getElementById("mess_box").innerHTML += `
  <span><span>${messages.username}: </span> ${messages.message} (<span>${messages.createAt}</span>)</span>
  </br>
  `;
});

// Gửi vị trí
document.getElementById("share_location").addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("trình duyệt không hỗ trợ share location");

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("share_location_to_server", { latitude, longitude });
  });
});

socket.on("send_location_to_client", (messages) => {
  document.getElementById("mess_box").innerHTML += `
  <span><span>${messages.username}: </span>  <a href=${messages.message}>my location </a> (<span>${messages.createAt}</span>)</span>
  </br>
  `;
});

// Xử lý query params
const queryparams = new URLSearchParams(window.location.search);
const room = queryparams.get("room");
const username = queryparams.get("username");
socket.emit("join_room_client_to_server", { room, username });

// Xử lý userList
socket.on("send_userList", (userList) => {
  const result = userList?.map((user) => `<li>${user.username}</li>`);
  document.getElementById("userList").innerHTML = result;
});
