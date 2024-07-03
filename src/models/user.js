const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Room = require('../models/room')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    // room: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
    // socketId: {
    //     type: String,
    // },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (userName, roomName) => {
    const room = await Room.findOne({ name: roomName})
    if (!room) {
        console.log(`Room with name '${roomName}' not found.`);
        return;
    }

    const memberNames = room.members.map(member => member.userName);
     if (!memberNames.includes(userName)) {
        console.log(`User '${userName}' is not a member of room '${roomName}'.`);
        return null;
    }
    const user = await User.findOne({ name: userName });
    return user;
}


const User = mongoose.model('User', userSchema)

module.exports = User