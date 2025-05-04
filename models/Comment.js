const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema({
    postId: {
        ref: 'Post',
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        ref: 'Users',
        type: Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment