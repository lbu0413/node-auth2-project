const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secret')
const router = require('express').Router()

const Users = require('../users/users-model')

router.post('/register', (req, res) => {
    const credentials = req.body
    const rounds = process.env.BCRYPT_ROUND || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds)

    credentials.password = hash;
    
    Users.add(credentials)
        .then(user => {
            res.status(201).json({ data: user})
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    Users.findBy({ username: username })
    .then(([user]) => {
        if(user && bcryptjs.compareSync(password, user.password)) {
            const token = makeToken(user)   
            res.status(200).json({ message: 'welcome to our API, ' + user.username, token})
        }
        else{
            res.status(401).json({ message: 'invalide credentials'})
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
})

const makeToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    }
    const options = {
        expiresIn: '900s'
    }
    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router