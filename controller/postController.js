const Post = require('../models/Post')
const Likes = require('../models/Likes')
const Comment = require('../models/Comment')
const { json } = require('express')

const getAllPost = async (req, res) => {
    try {
        const userId = req.user.id
        const posts = await Post.find().populate('user', 'username').sort({ createdAt: -1 })

        const postsWithLikes = await Promise.all(posts.map(async post => {
            const likeCount = await Likes.countDocuments({ postId: post._id })
            const commentCount = await Comment.countDocuments({ postId: post._id })

            let isLiked = false
            if (userId) {
                const userLike = await Likes.findOne({ postId: post._id, user: userId })
                isLiked = !!userLike
            }

            return {
                ...post.toObject(),
                likeCount,
                isLiked,
                commentCount 
            }
        }))

        res.status(200).json(postsWithLikes)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            error: err.message
        })
    }
}

const savePost = async (req, res) => {
    try {
        const postData = req.body
        const userId = req.user.id
        postData.user = userId

        const post = new Post(postData)
        
        const savedPost = await post.save()
        
        res.status(200).json({
            message: "Post saved successfully!",
            post: savedPost
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getSinglePost = async (req, res) => {
    try {
        const id = req.params.id
        
        const post = await Post.findById(id).populate('user', 'username')
        
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json( { error: err.message })
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId
    
        const deletedPost = await Post.findByIdAndDelete(postId)

        res.json({
            message: "Post successfully deleted",
            post: deletedPost
        })
    } catch (err) {
        res.json({error: err.message})
    }
}

const editPost = async (req, res) => {
    const { option, data } = req.body
    const postId = req.params.postId

    
    // console.log(option)
    if (!['title', 'postText'].includes(option)) {
        return res.status(400).json({ error: 'Invalid update option'})
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { [option]: data },
            { new: true }
        )

        if (!updatedPost) 
            return res.status(404).json({ error: 'Post not found'})

        res.json(updatedPost)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

module.exports = {
    getAllPost,
    getSinglePost,
    savePost,
    deletePost,
    editPost
}