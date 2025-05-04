const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        rquired: true
    }
}, { timestamps: true })

const User = mongoose.model('Users', UserSchema)

module.exports = User