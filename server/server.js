const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
var app = express();
var server = http.createServer(app);
var io = socketIo(server);

io.on('connection',(socket)=>{
    console.log('New user connected.');

    socket.on('disconnect',()=>{
        console.log('one user disconnected.')
    })
});

app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log(`Node Chat App is started on Port:${port}`)
});
