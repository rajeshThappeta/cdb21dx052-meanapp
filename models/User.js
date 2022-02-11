const mongoose = require("mongoose")

//create User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String, required: [true, "Username is required"],
        minLength: [4, "Username shd be more than 4 chars"]
    },
    password: { type: String, required: [true, "Password is required"] },
    email: { type: String, required: [true, "Email is required"] },
    city: { type: String, required: [true, "City is required"] },
    profileImage:{type:String},
    status:{type:Boolean,default:true}

}, { collection: 'usercollection' })

//create use model
const userModel = mongoose.model("user", userSchema)

//export model
module.exports = userModel