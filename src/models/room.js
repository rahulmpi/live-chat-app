const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    members: [{
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        socketId: {
             type: String,
             default: null
        },
    }],
    messages: [{
        sender_name: {
            type: String,
            ref: 'User',
            required: true,
            lowercase: true
        },
        text: {
            type: String,
        },
        url: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema)

module.exports = Room

