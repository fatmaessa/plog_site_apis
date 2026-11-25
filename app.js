const connectDB = require("./db/mongoose")

const express = require("express")
const app = express()
const port = process.env.PORT || 3000

const userRouter = require("./routers/user")
const postRouter = require("./routers/post")
const commentRouter = require("./routers/comment")
app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)

const startServer = async () => {
    await connectDB()

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startServer()