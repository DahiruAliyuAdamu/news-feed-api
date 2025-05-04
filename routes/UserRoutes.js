const express = require('express')
const multer = require('multer')
const { validateToken } = require('../middlewares/AuthMiddleware')

const { saveUser, allUsers, loginUser, validToken, profileInfo, changePassword } = require('../controller/UsersController')
const router = express.Router()
const upload = multer()

router.post('/', upload.none(), saveUser)
router.post('/login', loginUser)
router.get('/users', allUsers)
router.get('/auth', validateToken, validToken)

router.get('/profile/:id', profileInfo)
router.put('/changepassword', validateToken, upload.none(), changePassword)

module.exports = router