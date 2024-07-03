const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({
            error: 'User already in the room'
        })
    }
})

router.post('/users/login', async (req, res) => {
    const name = req.body.name.toLowerCase()
    const room = req.body.room.toLowerCase()
    try {
        const user = await User.findByCredentials(name, room)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

// router.post('/users/logout', auth, async (req, res) => {
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token !== req.token
//         })
//         await req.user.save()

//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.get('/users/me', auth, async (req, res) => {
//     res.send(req.user)
// })


module.exports = router