const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LikesSchema = new Schema({
    postId: {
        ref: 'Post',
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        ref: 'Users',
        type: Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

const Likes = mongoose.model('Likes', LikesSchema)

module.exports = Likes