const express = require('express')
const Room = require('../models/room')
const User = require('../models/user')
const router = new express.Router()


router.post('/rooms', async (req, res) => {
    try {
        const { name, members } = req.body;
        const existingUsernames = await User.find({ name: { $in: members.map(member => member.userName) } }).distinct('name');

        const missingUsers = members.filter(member => !existingUsernames.includes(member.userName));

        if (missingUsers.length > 0) {
           throw new Error(`User '${missingUsers[0].userName}' not found.`);
         }
         
        const newRoom = await Room.create({name, members});
        res.status(201).json(newRoom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Room name is already present' });
    }
});

router.patch('/rooms', async (req, res) => {
    try {
        const { name, members } = req.body;

        let room = await Room.findOne({ name });

        if (!room) {
            throw new Error(`Room with name '${name}' not found.`);
        }

        const existingMemberUsernames = room.members.map(member => member.userName);
        const newMembers = members.filter(member => !existingMemberUsernames.includes(member.userName));

        if (newMembers.length !== members.length) {
            throw new Error(`One or more members are already in the room.`);
        }

        const existingUsernames = await User.find({ name: { $in: members.map(member => member.userName) } }).distinct('name')

        const missingUsers = members.filter(member => !existingUsernames.includes(member.userName));

        if (missingUsers.length > 0) {
            throw new Error(`User '${missingUsers[0].userName}' not found.`);
         }

        room.members.push(...newMembers);

        room = await room.save();

        res.status(201).json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router