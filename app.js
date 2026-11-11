const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const db = require("./db/mongoose")

const userRouter = require("./routers/user")
const postRouter = require("./routers/post")
const commentRouter = require("./routers/comment")
app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)

app.listen(port,()=>{
    console.log(`app listening on port ${port}`)
})