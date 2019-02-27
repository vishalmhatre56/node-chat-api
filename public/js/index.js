var socket = io();

socket.on('connect', function () {
    console.log("Connected to server.")
});

socket.on('newMessage', function (message){
    console.log(`%c${message.from}\n%c${message.text}\n%c-${message.createdAt}`,"color: green;font-size:14px","color: black","color: grey")
})

socket.on('disconnect', function () {
    console.log("Disconnected from server.")
});

