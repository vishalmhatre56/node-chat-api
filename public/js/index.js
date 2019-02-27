var socket = io();

socket.on('connect', function () {
    console.log("Connected to server.")
});

socket.on('newMessage', function (message){
    console.log(`new message from:${message.from}\n${message.text}\n-${message.createdAt}`)
})

socket.on('disconnect', function () {
    console.log("Disconnected from server.")
});

