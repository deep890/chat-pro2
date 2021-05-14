const express = require('express')
const socket = require('socket.io')
const http = require('http')
const path = require('path')
const formatMessage = require('./utils/messages')
const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
} = require('./utils/users')

const PORT = 1900
const app = express()
const server = http.createServer(app)
const io = socket(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = "ChatPro";

// run when client connects
io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)

        // welcome current user
        socket.emit('message', formatMessage(botName, 'welcome to chatPro'))

        //  broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined the chatroom`))

        // user send room information
        io.to(user.room)
        .emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })

        
    })

    // listen for chat message
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))

    })
    //  run when client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room)
            .emit('message', formatMessage(botName, `${user.username} has left the chatroom`))
            // send user room information
            io.to(user.room)
            .emit('roomUsers', {
                room : user.room ,
                users : getRoomUsers(user.room)

            })
        }
    })
})




server.listen(PORT, () =>{console.log(`your server is running on ${PORT}`)})
