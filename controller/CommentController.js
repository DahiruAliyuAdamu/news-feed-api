const Comment = require('../models/Comment')
const Post = require('../models/Post')

const getComments = async (req, res) => {
    try {
        const postId = req.params.id

        // const post = await Post.findById(postId)
        
        const comments = await Comment.find({ postId: postId })
            .populate('user', 'username')
            .sort({ createdAt: -1})
        
        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const saveComment = async (req, res) => {
    try {
        const commentData = req.body
        const userId = req.user.id
        commentData.user = userId
        
        const comment = new Comment(commentData)

        const saveComment = await comment.save()

        const populatedComment = await saveComment.populate('user', 'username')

        res.status(200).json({
            message: 'comment successfully added',
            comment: populatedComment
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId
    
    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found' })
    }
    res.status(200).json({ message: 'Comment deleted successfully' })
}

module.exports = {
    getComments,
    saveComment,
    deleteComment
}