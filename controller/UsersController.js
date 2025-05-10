const Users = require('../models/Users')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')

const saveUser = async (req, res) => {
    const { fullName, username, email, phone, gender, bio, dob, password } = req.body

    try {
        const hash = await bcrypt.hash(password, 10)

        const newUser = new Users({
            fullName,
            username,
            email,
            phone,
            gender,
            bio,
            dob,
            password: hash
        })

        const user = await newUser.save()

        const { password: _, ...userData } = user.toObject(); // omit password

        res.status(201).json(userData)
    } catch (err) {

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({ message: `The ${field} is already taken.` });
        }
        
        res.status(500).json({ error: err.message })
    }
}

const allUsers = async (req, res) => {

}

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        const user = await Users.findOne({ username })

        if (!user) {
            return res.status(404).json({ error: 'User does not exist' })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({ error: 'Wrong username or password' })
        }

        const accessToken = sign(
            { username: user.username, id: user._id },
            process.env.JWT_SECRET
        )

        res.status(200).json({
            username: user.username,
            id: user._id,
            token: accessToken
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
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

    if (!req.user || !req.user.username) {
        return res.status(401).json({ error: 'Unauthorized: User info missing' })
    }

    try {
        const user = await Users.findOne({ username: req.user.username })
        if (!user) return res.status(404).json({ error: 'User not found' })

        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) return res.status(401).json({ error: 'Invalid old password' })

        if (oldPassword === newPassword) {
            return res.status(400).json({ error: 'New password must differ from old password' })
        }

        const hash = await bcrypt.hash(newPassword, 10)

        await Users.findByIdAndUpdate(user._id, { password: hash })

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error while changing password' })
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