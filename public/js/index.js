var socket = io();

socket.on('connect', function () {
    console.log("Connected to server.")
    
    socket.emit('createMessage', { 
        from: "julie",
        text: "ya sure, see you at ccd"
    });
});

socket.on('newMessage', function (message){
    console.log(`new message from:${message.from}\n${message.text}\n-${message.createdAt.toString()}`)
})

socket.on('disconnect', function () {
    console.log("Disconnected from server.")
});

