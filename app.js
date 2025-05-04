const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

const postRouter = require('./routes/postRouters')
const commentRouter = require('./routes/commentRoutes')
const userRouter = require('./routes/UserRoutes')
const likesRouter = require('./routes/LikesRoutes')

const app = express()

dotenv.config()

const PORT = process.env.PORT || 7000
const MONGOURI = process.env.MONGO_URI

app.use(express.json()) // for using json data
app.use(express.urlencoded({ extended: true })) // for using x-www-form-urlencoded
// app.use(morgan('dev'))
app.use(cors()) // allowing access from backend

app.use('/posts', postRouter)
app.use('/comments', commentRouter)
app.use('/auth', userRouter)
app.use('/likes', likesRouter)

mongoose.connect(MONGOURI).then(() => {
    app.listen(PORT)
    console.log("API is Live")
}).catch(err => console.log("Server not connected"))