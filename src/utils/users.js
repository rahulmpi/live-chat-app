const Room =  require("../models/room")

const users = []
const addUser = async ({ id, username, room }) => {
    const rooms = await Room.findOne({ name : room.toLowerCase()});
    const user = rooms.members.find((user) => user.userName === username.toLowerCase())
    user.socketId = id
    await rooms.save()
    users.push({room: rooms.name, name: username.toLowerCase(), socketId: id})
    return users[users.length - 1]
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.socketId === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.socketId === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}