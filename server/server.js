const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./uitils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New user connected.');
    //methods: socket.emit, io.emit, socket.broadcast.emit, io.to().emit, socket.broadcast.to().emit.
    socket.on('join', ({ username, room })=>{
        socket.join(room)

        socket.emit('newMessage', generateMessage("Admin", "Welcome to chat app."));
        socket.broadcast.to(room).emit('newMessage', generateMessage("Admin", `${username} has joined!`));


    })
    socket.on('createMessage', (newMessage, callback) => {
        io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
        callback('message from server')
    })
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('newMessage', generateMessage("Admin", "One user left."));
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Node Chat App is started on Port:${port}`)
});
