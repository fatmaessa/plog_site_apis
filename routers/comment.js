const express = require("express")
const router = express.Router()
const Comment = require("../models/comment")
const auth = require("../middleware/auth")
const UserPost = require("../models/post")

router.post("/posts/:id/comments", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const userPost = await UserPost.findOne({ _id,$or: [{ published: true }, { owner: req.user._id }]})
        if (!userPost) {
            return res.status(404).send("post not found")
        }
        const comment = new Comment({ text: req.body.text, post: _id, owner: req.user._id })
        await comment.save()
        res.status(201).send(comment)

    } catch (e) {
        res.status(400).send(e.message)
    }
})



router.get("/posts/:id/comments",auth,async(req,res)=>{
    try {
          const _id = req.params.id
        const userPost = await UserPost.findOne({ _id,$or: [{ published: true }, { owner: req.user._id }]})
        if (!userPost) {
            return res.status(404).send("post not found")
        }
        const comments= await Comment.find({post:_id})
        res.status(200).send(comments)
    } catch (e) {
       res.status(500).send(e.message) 
    }
})


router.get("/comments/:id",auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const comment = await Comment.findOne({_id})
        if(!comment){
           return res.status(404).send("comment not found")
        }
        res.status(200).send(comment)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.patch("/comments/:id",auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const allowed = ["text"]
        const isValid = updates.every((e)=>allowed.includes(e))
        if(!isValid){
            return res.status(400).send("updates is invalid")
        }
        const comment = await Comment.findOneAndUpdate({_id,owner:req.user._id},req.body,{
            runValidators:true,
            returnDocument:"after"
        })
        
        if(!comment){
            return res.status(404).send("comment not found")
        }
        res.status(200).send(comment)
    } catch (e) {
        res.status(500).send(e.message)
    }
})



router.delete("/comments/:id",auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const comment = await Comment.findOneAndDelete({_id,owner:req.user._id})
        if(!comment){
            return res.status(404).send("comment not found")
        }
        res.status(200).send(comment)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


module.exports = router