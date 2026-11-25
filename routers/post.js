const express = require("express")
const router = express.Router()
const UserPost = require("../models/post")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")

router.post("/posts", auth, async (req, res) => {
    try {
        const userPost = new UserPost({ ...req.body, owner: req.user._id })
        await userPost.save()
        res.status(201).send(userPost)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get("/posts", async (req, res) => {
    try {
        const filter = { published: true }
        if (req.query.author) {
            if(typeof req.query.author !== "string" || !mongoose.isValidObjectId(req.query.author)){
                return res.status(400).send("invalid author id")
            }
            filter.owner = req.query.author
        }
        if (req.query.search) {
            if(typeof req.query.search === "string" && req.query.search.length <= 50){
            filter.title = { $regex: req.query.search, $options: "i" }

            }
        }

        const sort = { createdAt: -1 }
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":")
            const allowedSort = ["createdAt", "title"]
            if (!allowedSort.includes(field)) {
                return res.status(400).send("invalid sort field")
            }
            delete sort.createdAt
            sort[field] = order === "desc" ? -1 : 1
        }

       let limit = parseInt(req.query.limit) 
      let skip = parseInt(req.query.skip) 
       if(isNaN(limit)||limit<1)limit=10
       if(limit>50)limit=50
       if(isNaN(skip)||skip<0)skip=0
        const usersPosts = await UserPost.find(filter).sort(sort).skip(skip).limit(limit)
        const total = await UserPost.countDocuments(filter)
        res.status(200).send({ total, count: usersPosts.length, usersPosts })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get("/posts/mine", auth, async (req, res) => {
    try {
        const filter = {owner:req.user._id}
        
        if (req.query.search) {
              if(typeof req.query.search === "string" && req.query.search.length <= 50){
            filter.title = { $regex: req.query.search, $options: "i" }

            }
        }
        if (req.query.published) {
    filter.published = req.query.published === "true"
}

        const sort = { createdAt: -1 }
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":")
            const allowedSort = ["createdAt", "title"]
            if (!allowedSort.includes(field)) {
                return res.status(400).send("invalid sort field")
            }
            delete sort.createdAt
            sort[field] = order === "desc" ? -1 : 1
        }

        let limit = parseInt(req.query.limit) 
        let skip = parseInt(req.query.skip) 
       if(isNaN(limit)||limit<1)limit=10
       if(limit>50)limit=50
       if(isNaN(skip)||skip<0)skip=0
        const userPosts = await UserPost.find(filter).sort(sort).skip(skip).limit(limit)
        const total = await UserPost.countDocuments(filter)

        res.status(200).send({total,userPosts})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get("/posts/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const userPost = await UserPost.findOne({ _id, $or: [{ published: true }, { owner: req.user._id }] })
        if (!userPost) {
            return res.status(404).send("Post Not Found")
        }
        res.status(200).send(userPost)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.patch("/posts/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const allowed = ['title', 'content', 'published']
        const isValid = updates.every((e) => allowed.includes(e))
        if (!isValid) {
            return res.status(400).send("invalid updates")
        }

        const userPost = await UserPost.findOneAndUpdate({ _id, owner: req.user._id }, req.body, {
            runValidators: true,
            returnDocument: "after"
        })
        if (!userPost) {
            return res.status(404).send("Post not found")
        }
        res.status(200).send(userPost)

    } catch (e) {
        res.status(500).send(e.message)
    }
})



router.delete("/posts/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id

        const userPost = await UserPost.findOne({ _id, owner: req.user._id })
        if (!userPost) {
            return res.status(404).send("Post notfound")
        }
        await userPost.deleteOne()
        res.status(200).send(userPost)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
