const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcryptjs = require('bcryptjs')
const validator = require("validator")
const Comment = require("./comment")
const UserPost = require("./post")

const userScheme = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("please enter valid email ")
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true,
        validate(val) {
            let password = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])")

            if (!password.test(val)) {
                throw new Error("password must include uppercase , lowercase , numbers, specialchracters")

            }
        }
    },

    age:{
        type:Number,
        default:20,
        validate(val){
            if(val<=0){
                throw new Error("age is not valid")
            }
        }
    },

    city:{
        type:String
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ]
},{timestamps:true})

//hashing password
userScheme.pre("save",async function(){
    const user = this
    if(user.isModified("password")){
user.password = await bcryptjs.hash(user.password,8)
    }
})

//login
userScheme.statics.findByCredentials = async function(email,password){

const user = await this.findOne({email})
if(!user){
    throw new Error("unable to login")
}
const isMatch = await bcryptjs.compare(password , user.password)

if(!isMatch){
        throw new Error("unable to login")

}

return user
}


//tokens

userScheme.methods.generateToken = async function() {
    const user = this
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}


// hide password and tokens

userScheme.methods.toJSON =  function(){
    const user = this
    const userObject = user.toObject()
     delete userObject.password
     delete userObject.tokens
      
     return userObject
}

userScheme.pre("deleteOne",{document:true,query:false},async function(){
const user = this
const posts = await UserPost.find({owner:user._id})
const postIds = posts.map((p) => p._id)

await Comment.deleteMany({post:{$in:postIds}})
await Comment.deleteMany({owner:user._id})
await UserPost.deleteMany({owner:user._id})
})

userScheme.virtual('posts',{
    ref:"UserPost",
    localField:"_id",
    foreignField:"owner"
})

const User = mongoose.model("User",userScheme)

module.exports = User
