const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const {generateMessage} = require('./uitils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.emit('newMessage', generateMessage("Admin", "Welcome to chat app."));
    socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined."));

    socket.on('createMessage',(newMessage,callback)=>{
        io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
        callback('message from server')
    })
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newMessage',generateMessage('Admin', `${coords.latitude},${coords.longitude}`))
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('newMessage', generateMessage("Admin", "One user left."));
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Node Chat App is started on Port:${port}`)
});
