const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    postText: {
        type: String,
        require: true
    },
    user: {
        ref: 'Users',
        type: Schema.Types.ObjectId,
        require: true
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)

module.exports = Post