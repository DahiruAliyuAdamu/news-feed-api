const express = require('express')
const multer = require('multer')
const postController = require('../controller/postController')
const { validateToken } = require('../middlewares/AuthMiddleware')

const router = express.Router()
const upload = multer() // Multer for form-data without files

router.get('/', validateToken, postController.getAllPost)
router.get('/byId/:id', postController.getSinglePost)
router.post('/', validateToken, upload.none(), postController.savePost)
router.delete('/:postId', validateToken, upload.none(), postController.deletePost)
router.put('/:postId', validateToken, upload.none(), postController.editPost)

module.exports = router