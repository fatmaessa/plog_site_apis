const express = require("express")
const router = express.Router()
const UserPost = require("../models/post")
const auth = require("../middleware/auth")

router.post("/posts", auth, async (req, res) => {
    try {
        const userPost = new UserPost({...req.body,owner:req.user._id})
        await userPost.save()
        res.status(201).send(userPost)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get("/posts",async(req,res)=>{
    try {
        const usersPosts = await UserPost.find({published:true})
        res.status(200).send(usersPosts)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get("/posts/mine", auth, async (req, res) => {
    try {
        await req.user.populate("posts")
        res.status(200).send(req.user.posts)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get("/posts/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const userPost = await UserPost.findOne({ _id ,$or: [{ published: true }, { owner: req.user._id }]})
        if (!userPost) {
            return res.status(404).send("Post Not Found")
        }
        res.status(200).send(userPost)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.patch("/posts/:id",auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const allowed = ['title','content','published']
        const isValid = updates.every((e)=>allowed.includes(e))
        if(!isValid){
            return res.status(400).send("invalid updates")
        }

        const userPost = await UserPost.findOneAndUpdate({_id,owner:req.user._id},req.body,{
            runValidators:true,
            returnDocument:"after"
        })
        if(!userPost){
            return res.status(404).send("Post not found")
        }
        res.status(200).send(userPost)
        
    } catch (e) {
        res.status(500).send(e.message)
    }
})



router.delete("/posts/:id",auth,async(req,res)=>{
    try {
        const _id = req.params.id

        const userPost = await UserPost.findOne({_id,owner:req.user._id})
        if(!userPost){
            return res.status(404).send("Post notfound")
        }
        await userPost.deleteOne()
        res.status(200).send(userPost)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
