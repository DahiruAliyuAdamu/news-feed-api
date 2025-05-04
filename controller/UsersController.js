const Users = require('../models/Users')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')

const saveUser = async (req, res) => {
    const { username, email, password } = req.body

    try {

        const hash = await bcrypt.hash(password, 10)

        const newUser = new Users({
            username: username,
            email: email,
            password: hash
        })

        const user = await newUser.save()

        res.json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

const allUsers = async (req, res) => {

}

const loginUser = async (req, res) => {
    const { username, password } =  req.body

    try {
        const user =  await Users.findOne({ username: username})
    
        if (!user) return res.status(200).json({ error: 'User does not Exists'})

        const match = await bcrypt.compare(password, user.password)

        if (!match) return res.status(200).json({ error: 'Wrong Username and Password entered'})
        
        const accessToken = sign({
            username: user.username,
            id: user._id
        }, "importantsecret")

        res.status(200).json({ 
            username: user.username,
            id: user._id,
            token: accessToken
        })
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

const validToken = (req, res) => {
    res.json(req.user)
}

const profileInfo = async (req, res) => {
    const id = req.params.id

    const profile = await Users.findById(id).select('-password')
    const posts = await Post.find({ user: id})

    res.json({profile, posts})
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    console.log('It works!!!!')
    try {
        const user = await Users.findOne({ username: req.user.username })
        if (!user) return res.status(404).json({ error: 'User not found' })

        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) return res.status(401).json({ error: 'Wrong old password entered' })

        const hash = await bcrypt.hash(newPassword, 10)

        await Users.findByIdAndUpdate(
            user._id,
            { password: hash },
            { new: true }
        )

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error while changing password' })
    }
}

module.exports = {
    saveUser,
    allUsers,
    loginUser,
    validToken,

    profileInfo,
    changePassword
}