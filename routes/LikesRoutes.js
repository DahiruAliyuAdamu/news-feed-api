const express = require('express')
const multer = require('multer')

const { saveLikes, getUserLikes } = require('../controller/LikesController')
const { validateToken } = require('../middlewares/AuthMiddleware')

const router = express.Router()
const upload = multer() // Multer for form-data without files

router.post('/', validateToken, upload.none(), saveLikes)
router.get('/user', validateToken, getUserLikes)

module.exports = router