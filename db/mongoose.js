const mongoose = require("mongoose")
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected succesfuly")
    } catch (error) {
        console.log("can not connect to database")
        process.exit(1)
    }
}

module.exports = connectDB
