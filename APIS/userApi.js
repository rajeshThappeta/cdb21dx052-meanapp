const exp = require("express")
const userModel = require("../models/User")
const userApp = exp.Router()
const verifyToken = require("./middlewares/verifyToken")
require("dotenv").config()
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const expressAsyncHandler = require("express-async-handler")
var cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
userApp.use(exp.json())




//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

//configure cloudinary stoarge multer
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "CDB21DX052",
            pubilc_id: file.fieldname + '-' + Date.now()
        }
    }
})
//configure multer
const upload = multer({ storage: cloudinaryStorage })







//create user
userApp.post('/createuser', upload.single('photo'), expressAsyncHandler(async (req, res) => {

    //Image url returned from cloudinary
    let imgCdn = req.file.path;

    //get userObj from client and convert from string to object
    let userObjFromClient = JSON.parse(req.body.userObj)

    //check username existance
    let userObjFromDb = await User.findOne({ username: userObjFromClient.username })
    // if user is already eisted
    if (userObjFromDb !== null) {
        res.status(200).send({ message: "User already existed" })
    }
    //if user not existed
    else {
        userObjFromClient.profileImage = imgCdn;
        //creaet user document
        let userObj = new User({ ...userObjFromClient })

        //hash the password
        let hashedPassword = await bcryptjs.hash(userObjFromClient.password, 5)
        //replace plain pw with hashed pw
        userObj.password = hashedPassword;
        //save
        let newUser = await userObj.save()
        //res        
        res.status(201).send({ message: "User created", payload: newUser })
    }

}))

//Login user
userApp.post("/login", expressAsyncHandler(async (req, res) => {

    //get user dred from client
    let userCredObj = req.body;
    //find user by username
    let userFromDB = await User.findOne({ username: userCredObj.username })
    //if no user found
    if (userFromDB == null) {
        res.status(200).send({ message: "Invalid username" })
    }
    //if user found, then compare passwords
    else {
        let status = await bcryptjs.compare(userCredObj.password, userFromDB.password)
        //if passwords are not matched
        if (status == false) {
            res.status(200).send({ message: "Invalid password" })
        }
        //if passwords matched,create token and sendin res
        else {
            let signedToken = await jwt.sign({ username: userFromDB.username }, process.env.SECRET_KEY, { expiresIn: 2000 });

            res.status(200).send({ message: "login success", token: signedToken, user: userFromDB })
        }
    }

}))


//get user by username
userApp.get("/getuser/:username", expressAsyncHandler(async (req, res) => {

    //get username from url
    let usernameFromUrl = req.params.username;
    //find user  by username
    let userFromDb = await User.findOne({ username: usernameFromUrl }).exec()

    //if user not found,it reqturns null
    if (userFromDb == null) {
        res.status(404).send({ message: "User not found" })
    }
    //if user existed
    else {
        res.status(200).send({ message: "user existed", payload: userFromDb })
    }

}))


//update user
userApp.put("/updateuser", expressAsyncHandler(async (req, res) => {

    //get username from url
    let userFromClient = req.body;
    //find user by username and update    
    await User.findOneAndUpdate({ username: userFromClient.username },
        { $set: { ...userFromClient } })
    //send res
    res.status(200).send({ message: "User updated" })

}))


//delete user
userApp.put("/deleteuser", expressAsyncHandler((async (req, res) => {

    //get username from url
    let userFromClient = req.body;
    //find user by username and update    
    await User.findOneAndUpdate({ username: userFromClient.username },
        { $set: { status: userFromClient.status } })
    //send res
    res.status(200).send({ message: "User removed" })


})))




//PRIVATE ROUTES
//adding task
userApp.post("/addtask", verifyToken, expressAsyncHandler(async (req, res) => {
    res.send({ message: "New product added" })
}))
//view tasks
userApp.get("/viewtasks", verifyToken, expressAsyncHandler((req, res) => {
    res.send("All tasks")
}))





//error handling middleware
userApp.use((err, req, res, next) => {

    //console.log("err")
    res.send({ message: "Error", payload: err.message })
})

module.exports = userApp