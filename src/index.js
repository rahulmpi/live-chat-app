const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io');
const Filter = require('bad-words')
require('./db/mongoose')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, getUsersInRoom, removeUser, getUser } = require('./utils/users')
const userRouter = require('./routes/user')
const roomRouter = require('./routes/rooms')
const Room = require('./models/room')
const app = express()
const cors = require('cors')
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173"
    }
});

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(cors())
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(userRouter)
app.use(roomRouter)

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join', async (options, callback) => {
        const user = await addUser({id: socket.id, ...options})
         socket.join(user.room)

        // socket.emit('message', generateMessage('Admin', 'Welcome!'))
         //   socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.name} has joined!`))
            const allMsg = await Room.findOne({name: user.room})
            io.to(user.room).emit('message', allMsg.messages)
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            
            callback()
    })

    socket.on('sendMessage', async (message, callback) => {
        const user = await getUser(socket.id)
        console.log(user)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        
        const newMessage = {
            sender_name: user.name,
            text: message,
        };

        const room = await Room.findOneAndUpdate(
            { name: user.room },
            { $push: { messages: newMessage } },
            { new: true }
        );

        io.to(user.room).emit('message', room.messages);
        callback()
    })

    socket.on('sendLocation', async (coords, callback) => {
        const user = await getUser(socket.id)
        const newMessage = {
            sender_name: user.name,
            url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        };

        const room = await Room.findOneAndUpdate(
            { name: user.room },
            { $push: { messages: newMessage } },
            { new: true }
        );

        io.to(user.room).emit('locationMessage', room.messages)
        callback()
    })

    socket.on('disconnect', async () => {
        console.log('Connection failed')
        const user = removeUser(socket.id)
        if (user) {
           // io.to(user.room).emit('message', [generateMessage('Admin', `${user.name} has left!`)])
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})