const mongoose = require("mongoose")
const Comment = require("./comment")

const postSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true, 
    },
    content:{
        type:String,
        required:true
    },
    published:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },

    

},{timestamps:true})


postSchema.pre("deleteOne", { document: true, query: false }, async function () {
    await Comment.deleteMany({ post: this._id })
})

const UserPost = mongoose.model("UserPost", postSchema)

module.exports = UserPost