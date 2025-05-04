const Users = require('../models/Users')
const Post = require('../models/Post')
const Likes = require('../models/Likes')

const saveLikes = async (req, res) => {
    const { postId } = req.body
    const userId = req.user.id
    
    const likeData = {
        postId: postId,
        user: userId
    }
    const existingLike = await Likes.findOne(likeData)

    if (existingLike) {
        await Likes.findByIdAndDelete(existingLike._id)
        res.json({ status: "Unlike" })
    } else {
        const likes = new Likes(likeData)
        await likes.save()
    
        res.json({status: "Like"})
    }
}

// GET /likes/user
const getUserLikes = async (req, res) => {
    const userId = req.user.id;
    const likes = await Likes.find({ user: userId })
    res.json(likes)
}

module.exports = {
    saveLikes,
    getUserLikes
}