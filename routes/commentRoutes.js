const express = require('express')
const multer = require('multer')

const commentController = require('../controller/CommentController')
const { validateToken } = require('../middlewares/AuthMiddleware')

const router = express.Router()
const upload = multer() // Multer for form-data without files

router.get('/:id', commentController.getComments)
router.post('/', validateToken, upload.none(), commentController.saveComment)
router.delete('/:commentId', validateToken, commentController.deleteComment)

module.exports = router