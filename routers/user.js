const express = require("express")
const router = express.Router()
const User = require("../models/user")
const auth = require("../middleware/auth")

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e.message)
    }

})

router.get("/users/me", auth, async (req, res) => {
    try {


        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch("/users/me", auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowed = ["username", "email", "password", "age", "city"]
        const isValid = updates.every((e)=>allowed.includes(e))
        if(!isValid){
            return res.status(400).send("invalid updates")
        }
        updates.forEach((ele) => req.user[ele] = req.body[ele])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }

})


router.post("/login",async(req,res)=>{
    try{
    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateToken()
    res.status(200).send({user,token})
    }catch(e){
     res.status(400).send(e.message)
    }
})



router.delete("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((ele)=>{
            return ele !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
      res.status(500).send(e.message)
    }
})



router.delete("/logoutall",auth,async(req,res)=>{
   try{
     req.user.tokens = []
     await req.user.save()
     res.send()   

   }catch(e){
     res.status(500).send(e.message)
   }   
})


module.exports = router