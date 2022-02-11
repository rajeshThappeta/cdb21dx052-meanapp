
const jwt = require("jsonwebtoken")
require("dotenv").config()
//create a middleware which can verify beare token
const verifyToken = (req, res, next) => {


    //get bearer token
    let bearerToken = req.headers.authorization;

    //if bearertoken is undefined
    if (bearerToken == undefined) {
      return  res.status(200).send({ message: "Unauthorised request" })
    }
    //extract token
    let token = bearerToken.split(" ")[1]
    console.log(token)
    //verify the token with same secret key used for encryption
    //if token is invalid, it will throw error object which will be caught by error handler
    try {
        jwt.verify(token, process.env.SECRET_KEY)
        //if token is valid
        next()
    }
    catch (err) {
        //forward error obj to error handing middleware
        next(new Error("Session expired..relogin to continue"))

    }
}


module.exports = verifyToken