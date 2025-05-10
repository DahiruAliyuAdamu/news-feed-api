const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ""
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Users = mongoose.model('Users', UserSchema)

module.exports = Users